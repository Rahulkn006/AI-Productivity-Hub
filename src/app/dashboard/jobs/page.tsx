import { JobSearchClient } from "@/components/jobs/jobs-client"
import { getJobSearchHistory } from "@/app/actions/jobs"

export const metadata = {
  title: "AI Job Search - AI Productivity Hub",
}

export default async function JobsPage() {
  const history = await getJobSearchHistory()

  return (
    <div className="h-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
            AI Job Search
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm max-w-xl">
            Let our AI agents scour the internet to find and rank the most relevant job postings based on your exact skills and preferences.
          </p>
        </div>
      </div>

      <JobSearchClient initialHistory={history} />
    </div>
  )
}
