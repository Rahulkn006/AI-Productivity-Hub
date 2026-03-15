/**
 * Job Aggregator
 * Orchestrates multiple job sources and normalizes data
 */
import { fetchJSearchJobs, Job } from "./jsearch";
import { scrapeJobsWithFirecrawl } from "./job-scraper";
import { generateAiResponse } from "./ai";

export async function aggregateJobs(role: string, skills: string, location: string, workMode: string): Promise<Job[]> {
  console.log(`Aggregating jobs for: ${role} in ${location} (${workMode})`);
  
  let allJobs: Job[] = [];

  // 1. Primary Source: JSearch API (High quality, already normalized)
  try {
    const jsearchJobs = await fetchJSearchJobs(role, location, workMode);
    console.log(`JSearch returned ${jsearchJobs.length} jobs`);
    allJobs = [...jsearchJobs];
  } catch (e) {
    console.error("Aggregator JSearch Error:", e);
  }

  // 2. Fallback: Firecrawl Scraping (If results are sparse)
  if (allJobs.length < 5) {
    console.log("Results sparse (<5), triggering Firecrawl fallback...");
    try {
      const scrapedResults = await scrapeJobsWithFirecrawl(role, location, workMode);
      
      if (scrapedResults.length > 0) {
        // We use AI to extract structured jobs from the messy web search results
        const combinedScrapedContent = scrapedResults
          .map((item: any) => `URL: ${item.url}\nTitle: ${item.title}\nSnippet: ${item.snippet || ''}\nContent:\n${(item.markdown || '').substring(0, 2000)}`)
          .join('\n\n---\n\n');

        const extractionPrompt = `
          Extract actual job listings from this web content for the role: ${role}.
          
          Criteria:
          Location: ${location || 'Any'}
          Work Mode: ${workMode}
          Skills: ${skills}

          Content:
          ${combinedScrapedContent}

          Return a JSON array of objects with this schema:
          [{ "title": "Job Title", "company": "Company Name", "location": "City, Country", "description": "Brief summary", "apply_link": "URL", "type": "Full-time/Contract etc", "experience": "Requirement", "salary": "Range/Not specified" }]
          
          Return ONLY the raw JSON array.
        `;

        const aiResponse = await generateAiResponse(extractionPrompt);
        try {
          // Clean up potential markdown formatting
          const cleanJson = aiResponse.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
          const extractedJobs = JSON.parse(cleanJson);
          
          if (Array.isArray(extractedJobs)) {
            console.log(`Extracted ${extractedJobs.length} jobs from Firecrawl results via AI`);
            // Avoid duplicates by link if possible
            const existingLinks = new Set(allJobs.map(j => j.apply_link));
            const uniqueExtracted = extractedJobs.filter((j: any) => !existingLinks.has(j.apply_link));
            allJobs = [...allJobs, ...uniqueExtracted];
          }
        } catch (parseError) {
          console.error("AI Extraction Parse Error:", parseError, aiResponse);
        }
      }
    } catch (e) {
      console.error("Aggregator Scraper Fallback Error:", e);
    }
  }

  return allJobs;
}
