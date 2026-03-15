import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { generateAiResponse } from '@/lib/ai'
import { aggregateJobs } from '@/lib/job-aggregator'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role, skills, location, workMode, experienceLevel, jobType } = await req.json()

    if (!role) {
      return NextResponse.json({ error: 'Job role is required' }, { status: 400 })
    }

    // 1. Get consolidated jobs from multiple sources
    console.log("Starting multi-source job aggregation...")
    const jobs = await aggregateJobs(role, skills || '', location || '', workMode || 'any')

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ 
        error: 'No job listings found even after broad search. Please try a more general role like "Developer" or a larger city.' 
      }, { status: 404 })
    }

    // 2. Final AI Step: Personalization & Ranking
    const prompt = `
    You are an expert career coach and technical recruiter.
    I have a list of job openings found for: ${role} in ${location || 'India'}.
    
    User Criteria:
    Role: ${role}
    Experience Level: ${experienceLevel}
    Job Type: ${jobType}
    Desired Skills: ${skills || 'Any'}

    Jobs Data:
    ${JSON.stringify(jobs.slice(0, 15), null, 2)}

    Action:
    1. Filter out any clearly irrelevant results.
    2. Rank the remaining jobs by how well they match the User Criteria.
    3. For EACH job, generate a one-sentence "match_reason" explaining why it's a good fit for this specific user.
    
    Return the result EXACTLY as a JSON array of objects with this schema:
    [
      {
        "company": "Company Name",
        "role": "Job Title",
        "location": "Location",
        "type": "Employment Type",
        "experience": "Experience Required",
        "salary": "Salary Info",
        "link": "Application Link",
        "match_reason": "Personalized reason why this fits the user's skills/level"
      }
    ]
    Return ONLY raw JSON.
    `

    console.log("Starting final AI ranking and personalization...")
    let aiResponseText = await generateAiResponse(prompt)
    
    // Clean up potential markdown formatting
    aiResponseText = aiResponseText.replace(/```json\n?/, '').replace(/```\n?$/, '').trim()

    let rankedJobs = []
    try {
      rankedJobs = JSON.parse(aiResponseText)
    } catch (e) {
      console.error("AI Rank JSON Parse Error:", e, aiResponseText)
      // Fallback to unranked list if AI fails to structure correctly
      rankedJobs = jobs.slice(0, 10).map(j => ({ 
        company: j.company,
        role: j.title,
        location: j.location,
        type: j.type,
        experience: j.experience,
        salary: j.salary,
        link: j.apply_link,
        match_reason: 'Highly relevant match found across top job boards.' 
      }))
    }

    // 3. Save search history to DB
    const { error: dbError } = await supabase.from('job_search_history').insert([{
      user_id: user.id,
      query: `${experienceLevel !== 'any' ? `${experienceLevel} ` : ''}${workMode !== 'any' ? `${workMode} ` : ''}${role} in ${location || 'India'}`,
      results: rankedJobs
    }])

    if (dbError) {
      console.error("Failed to save job search history:", dbError)
    }

    return NextResponse.json({ result: rankedJobs })

  } catch (error: any) {
    console.error("Job Search API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
