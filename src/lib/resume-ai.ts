import { generateAiResponse } from "./ai";
import { ResumeDetails } from "./resume-types";

export async function optimizeResumeAndScore(resumeData: ResumeDetails) {
  const prompt = `
You are an expert ATS (Applicant Tracking System) optimizer and professional resume writer.
I am providing you with the details of a user's resume and their target job role.

Target Job Role: ${resumeData.targetJobRole}
Current Resume Details in JSON:
${JSON.stringify({
  personalDetails: resumeData.personalDetails,
  education: resumeData.education,
  skills: resumeData.skills,
  experience: resumeData.experience,
  projects: resumeData.projects
})}

Task:
1. Generate a concise "summary" (under 50 words) that highlights the user's key strengths and career objectives for the Target Job Role.
2. Revise the "description" fields within "experience" and "projects" to be professional, impactful, action-oriented, and ATS-friendly for the Target Job Role. 
   IMPORTANT: If the original description is empty or very short, generate 2-3 concise bullet points.
3. Determine an ATS Score (out of 100) based on how well the existing skills and experience match the typical requirements of the Target Job Role.
4. Identify 3-5 crucial industry missing keywords or skills.
5. Provide up to 3 formatting or structural suggestions.
6. Provide up to 3 overall content improvement suggestions.

Return your response ONLY in the following JSON format:
{
  "summary": "concise professional summary...",
  "optimizedExperience": [
    { "company": "...", "role": "...", "startDate": "...", "endDate": "...", "description": "optimized text..." }
  ],
  "optimizedProjects": [
    { "name": "...", "link": "...", "technologies": ["..."], "description": "optimized text..." }
  ],
  "atsScore": {
    "score": 85,
    "missingKeywords": ["keyword1", "keyword2"],
    "formattingSuggestions": ["suggestion1"],
    "contentSuggestions": ["suggestion1"]
  }
}

Return ONLY the raw JSON object.
`;

  try {
    const aiResponse = await generateAiResponse(prompt);
    // Clean up potential markdown formatting
    const cleanJson = aiResponse.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error optimizing resume:", error);
    throw error;
  }
}
