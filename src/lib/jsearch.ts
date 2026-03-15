/**
 * JSearch API integration via RapidAPI
 * Primary source for high-quality structured job listings
 */

export interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  apply_link: string;
  salary?: string;
  type?: string;
  experience?: string;
}

export async function fetchJSearchJobs(query: string, location?: string, workMode?: string): Promise<Job[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.error("RAPIDAPI_KEY is missing");
    return [];
  }

  // Optimize query for JSearch
  const fullQuery = `${query}${location ? ` in ${location}` : ''}${workMode === 'remote' ? ' remote' : ''}`;
  
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(fullQuery)}&num_pages=1`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.warn("JSearch returned no data or invalid format:", data);
      return [];
    }

    // Normalize JSearch results
    return data.data.map((job: any) => ({
      title: job.job_title || 'N/A',
      company: job.employer_name || 'N/A',
      location: job.job_city && job.job_country 
        ? `${job.job_city}, ${job.job_country}` 
        : (job.job_location || 'Remote/Unknown'),
      description: job.job_description || '',
      apply_link: job.job_apply_link || job.job_google_link || '',
      salary: job.job_salary_period 
        ? `${job.job_min_salary || ''} - ${job.job_max_salary || ''} ${job.job_salary_currency || ''} (${job.job_salary_period})`
        : 'Not specified',
      type: job.job_employment_type || 'Full-time',
      experience: job.job_required_experience?.required_experience_in_months 
        ? `${Math.ceil(job.job_required_experience.required_experience_in_months / 12)}+ years`
        : 'Not specified'
    }));
  } catch (error) {
    console.error("JSearch API Error:", error);
    return [];
  }
}
