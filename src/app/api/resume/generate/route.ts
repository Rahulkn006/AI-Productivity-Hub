import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { optimizeResumeAndScore } from "@/lib/resume-ai";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeData } = await req.json();

    if (!resumeData || !resumeData.targetJobRole) {
      return NextResponse.json({ error: "Resume data and target job role are required" }, { status: 400 });
    }

    console.log(`Optimizing resume for user: ${user.id} targeting: ${resumeData.targetJobRole}`);
    const optimizedResults = await optimizeResumeAndScore(resumeData);

    return NextResponse.json(optimizedResults);
  } catch (error: any) {
    console.error("Resume Optimization Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to optimize resume" }, { status: 500 });
  }
}
