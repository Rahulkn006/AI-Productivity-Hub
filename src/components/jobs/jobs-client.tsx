"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Briefcase, MapPin, Code2, Sparkles, Loader2, Globe2, Building2, CheckCircle2, History, Trash2, ExternalLink, Filter, Search } from "lucide-react"
import { toast } from "sonner"
import { deleteJobSearch } from "@/app/actions/jobs"
import { ScrollArea } from "@/components/ui/scroll-area"

const COMMON_ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Engineer",
  "Data Scientist", "Data Analyst", "Data Engineer", "Machine Learning Engineer",
  "UI/UX Designer", "Product Designer", "Web Designer",
  "Product Manager", "Project Manager", "Business Analyst",
  "DevOps Engineer", "Cloud Architect", "System Administrator",
  "Mobile Developer", "iOS Developer", "Android Developer",
  "QA Engineer", "Automation Tester", "Security Engineer",
  "Marketing Manager", "Content Writer", "Social Media Manager",
  "Sales Representative", "Account Manager", "Customer Success Manager",
  "HR Manager", "Technical Recruiter", "Operations Manager"
]

export function JobSearchClient({ initialHistory }: { initialHistory: any[] }) {
  const [role, setRole] = useState("")
  const [skills, setSkills] = useState("")
  const [location, setLocation] = useState("")
  const [workMode, setWorkMode] = useState("any")
  const [experienceLevel, setExperienceLevel] = useState("any")
  const [jobType, setJobType] = useState("any")
  const [isLoading, setIsLoading] = useState(false)
  
  const [history, setHistory] = useState(initialHistory)
  const [activeResults, setActiveResults] = useState<any[] | null>(null)

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleRoleChange = (value: string) => {
    setRole(value)
    if (value.trim().length > 0) {
      const filtered = COMMON_ROLES.filter(r => 
        r.toLowerCase().includes(value.toLowerCase()) && 
        r.toLowerCase() !== value.toLowerCase()
      ).slice(0, 5) // Show top 5 matches
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (s: string) => {
    setRole(s)
    setShowSuggestions(false)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) {
      toast.error("Role is required")
      return
    }

    setIsLoading(true)
    setShowSuggestions(false)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, skills, location, workMode, experienceLevel, jobType })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to search jobs')
      }

      setActiveResults(data.result)
      
      const newEntry = {
        id: 'temp-' + Date.now(),
        query: `${experienceLevel !== 'any' ? `${experienceLevel} ` : ''}${workMode !== 'any' ? `${workMode} ` : ''}${role} jobs${location ? ` in ${location}` : ''}`,
        results: data.result,
        created_at: new Date().toISOString()
      }
      setHistory([newEntry, ...history])
      
      toast.success(`Found ${data.result.length} highly matched jobs!`)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (!id.startsWith('temp-')) {
        await deleteJobSearch(id)
      }
      setHistory(history.filter(h => h.id !== id))
      toast.success('Search history removed')
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      
      {/* Search Panel */}
      <div className="w-full xl:w-96 flex flex-col gap-6 shrink-0">
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">AI Recruiter</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Suggestions Enabled</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-1.5 relative" ref={suggestionRef}>
               <Label htmlFor="role" className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Target Role</Label>
               <div className="relative">
                 <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <Input 
                   id="role"
                   value={role} onChange={e => handleRoleChange(e.target.value)}
                   onFocus={() => role.trim().length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
                   placeholder="e.g. Frontend Developer" 
                   className="pl-9 bg-slate-50 dark:bg-slate-800 border-transparent focus-visible:ring-emerald-500" 
                   disabled={isLoading}
                   autoComplete="off"
                   required
                 />
               </div>
               
               {/* Suggestions Dropdown */}
               {showSuggestions && (
                 <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                   {suggestions.map((s, i) => (
                     <button
                       key={i}
                       type="button"
                       onClick={() => selectSuggestion(s)}
                       className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                     >
                       <Search className="w-3 h-3 text-slate-400" />
                       {s}
                     </button>
                   ))}
                 </div>
               )}
            </div>

            <div className="space-y-1.5">
               <Label htmlFor="skills" className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Required Skills</Label>
               <div className="relative">
                 <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <Input 
                   id="skills"
                   value={skills} onChange={e => setSkills(e.target.value)}
                   placeholder="e.g. React, Next.js, Tailwind" 
                   className="pl-9 bg-slate-50 dark:bg-slate-800 border-transparent focus-visible:ring-emerald-500" 
                   disabled={isLoading}
                 />
               </div>
            </div>

            <div className="space-y-1.5">
               <Label htmlFor="location" className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Location</Label>
               <div className="relative">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <Input 
                   id="location"
                   value={location} onChange={e => setLocation(e.target.value)}
                   placeholder="e.g. New York, London" 
                   className="pl-9 bg-slate-50 dark:bg-slate-800 border-transparent focus-visible:ring-emerald-500" 
                   disabled={isLoading || workMode === 'remote'}
                 />
               </div>
            </div>

            {/* Filters Row */}
            <div className="space-y-3 pt-2">
               <div className="space-y-2">
                  <Label className="text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest block text-center">Work Mode</Label>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {['any', 'onsite', 'hybrid', 'remote'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                            setWorkMode(mode)
                            if (mode === 'remote') setLocation("")
                        }}
                        className={`py-1 rounded-md text-[9px] font-bold capitalize transition-all ${
                          workMode === mode 
                            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                        disabled={isLoading}
                      >
                        {mode === 'onsite' ? 'Onsite' : mode}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest block text-center">Experience</Label>
                  <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {['any', 'junior', 'mid', 'senior', 'executive'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setExperienceLevel(level)}
                        className={`py-1 rounded-md text-[9px] font-bold capitalize transition-all ${
                          experienceLevel === level 
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                        disabled={isLoading}
                      >
                        {level === 'mid' ? 'Mid' : level}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest block text-center">Job Type</Label>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {['any', 'full-time', 'contract', 'internship'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setJobType(type)}
                        className={`py-1 rounded-md text-[9px] font-bold capitalize transition-all ${
                          jobType === type 
                            ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                        disabled={isLoading}
                      >
                        {type === 'full-time' ? 'Full' : type === 'internship' ? 'Intern' : type}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 dark:shadow-none transition-all mt-2" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Start AI Search</>
              )}
            </Button>
          </form>
        </Card>

        {/* History Panel */}
        <Card className="flex-1 min-h-[200px] flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/20">
             <History className="w-4 h-4 text-slate-500" />
             <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Searches</h3>
           </div>
           <ScrollArea className="flex-1 p-2">
              <div className="space-y-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveResults(item.results)}
                    className="w-full p-2.5 rounded-lg flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate capitalize">{item.query}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{new Date(item.created_at).toLocaleDateString()} • {item.results?.length || 0} results</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500" onClick={(e) => handleDeleteHistory(item.id, e)}>
                       <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
           </ScrollArea>
        </Card>
      </div>

      {/* Results Panel */}
      <div className="flex-1 flex flex-col">
         {activeResults ? (
            <div className="space-y-4 pb-12">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                   AI Ranked Matches
                 </h2>
                 <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" onClick={() => setActiveResults(null)} className="h-8 text-xs">
                     Clear
                   </Button>
                   <span className="text-xs font-bold px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                     {activeResults.length} Jobs
                   </span>
                 </div>
               </div>

               <div className="grid gap-4">
                 {activeResults.map((job: any, i: number) => (
                   <Card key={i} className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                     <Building2 className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50 dark:text-slate-800/20 pointer-events-none transform -rotate-12 transition-transform group-hover:scale-110" />
                     
                     <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                       <div className="flex-1">
                         <div className="flex flex-wrap items-center gap-2 mb-2">
                           <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">{job.company}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                           <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                             <MapPin className="w-3 h-3" /> {job.location}
                           </span>
                           {job.type && (
                             <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-900/10 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/30 font-bold uppercase tracking-tighter">
                               {job.type}
                             </span>
                           )}
                         </div>
                         <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2">{job.role}</h3>
                         
                         <div className="flex items-center gap-4 mb-3">
                           {job.salary && job.salary !== 'Not specified' && (
                             <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                               {job.salary}
                             </span>
                           )}
                           {job.experience && (
                              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                <Filter className="w-3 h-3" /> {job.experience}
                              </span>
                           )}
                         </div>

                         <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 mt-4 backdrop-blur-sm">
                           <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
                             <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                             <span>{job.match_reason}</span>
                           </p>
                         </div>
                       </div>

                       <div className="shrink-0 pt-2 sm:pt-0">
                         <Button className="w-full sm:w-auto bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 p-0 overflow-hidden">
                           <a href={job.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold px-6 py-2 h-full w-full">
                             Apply <ExternalLink className="w-4 h-4" />
                           </a>
                         </Button>
                       </div>
                     </div>
                   </Card>
                 ))}
               </div>
            </div>
         ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-6 rotate-3">
                <Briefcase className="w-10 h-10 text-emerald-500/20 dark:text-emerald-400/20" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Your Next Career Move</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                Tell us your role and skills. Our AI will scan job boards and rank the best openings for your specific profile and experience level.
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Real-time search</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> AI Ranked</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Direct Links</div>
              </div>
            </div>
         )}
      </div>

    </div>
  )
}
