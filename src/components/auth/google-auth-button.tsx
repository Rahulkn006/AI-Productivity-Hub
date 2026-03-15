"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Chrome } from "lucide-react";

export default function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full sm:w-auto flex items-center gap-2 rounded-full"
      onClick={handleLogin}
      disabled={isLoading}
    >
      <Chrome className="w-5 h-5" />
      {isLoading ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
}
