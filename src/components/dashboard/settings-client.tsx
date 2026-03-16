"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { 
  Moon, 
  Sun, 
  Laptop, 
  User, 
  Settings2, 
  LogOut,
  Sparkles,
  ShieldCheck
} from "lucide-react"

interface SettingsClientProps {
  user: any;
}

export function SettingsClient({ user }: SettingsClientProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="animate-pulse space-y-8">
      <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
    </div>
  }

  return (
    <div className="grid gap-8 pb-10">
      {/* Profile Section */}
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            <CardTitle>Profile Details</CardTitle>
          </div>
          <CardDescription>Your account information from Google.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img 
              src={user?.avatar_url || "https://avatar.vercel.sh/user"} 
              alt="Profile" 
              className="w-20 h-20 rounded-2xl shadow-lg border-2 border-white dark:border-slate-800"
            />
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold">{user?.full_name || "Guest User"}</h3>
              <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-3 h-3" />
                Verified Account
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-indigo-500" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize how the platform looks for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Theme Preference</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="flex items-center gap-2 rounded-xl"
                onClick={() => setTheme("light")}
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="flex items-center gap-2 rounded-xl"
                 onClick={() => setTheme("dark")}
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                className="flex items-center gap-2 rounded-xl"
                onClick={() => setTheme("system")}
              >
                <Laptop className="w-4 h-4" />
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Preferences Section */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <CardTitle>AI Preferences</CardTitle>
          </div>
          <CardDescription>Configure how AI agents interact with you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
               <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-400 text-sm italic">Pro Tip</h4>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                AI Productivity Hub uses advanced models to provide insights. You can currently adjust your theme and profile which directly impacts how AI renders content for you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Section */}
      <Card className="border-red-100 dark:border-red-900/30 shadow-sm">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Actions that cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
           <form action="/auth/signout" method="POST">
            <Button variant="destructive" className="rounded-xl flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out of Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
