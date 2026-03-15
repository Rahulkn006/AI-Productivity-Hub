/**
 * Firecrawl Web Scraper for Jobs
 * Robust fallback for custom job boards and niche listings
 */
import FirecrawlApp from '@mendable/firecrawl-js'

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

export async function scrapeJobsWithFirecrawl(role: string, location: string, workMode: string): Promise<any[]> {
  const workModeStr = workMode === 'remote' ? 'remote ' : ''
  const locationStr = location ? ` in ${location}` : ''
  
  // Try a targeted search on major boards
  const query = `${workModeStr}${role} jobs${locationStr} site:linkedin.com/jobs OR site:naukri.com OR site:indeed.com`

  try {
    const response = await firecrawl.search(query, {
      limit: 10,
      scrapeOptions: { 
        formats: ['markdown'],
        onlyMainContent: true
      }
    }) as any

    const results = Array.isArray(response) ? response : (response?.data || response?.results || []);
    
    // We return the raw search results here because the aggregator will use AI for final extraction/normalization
    // to ensure high quality from messy web content.
    return results.map((item: any) => ({
      ...item,
      source: 'firecrawl'
    }));
  } catch (error) {
    console.error("Firecrawl Scraper Error:", error);
    return [];
  }
}
