"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

export default function GoogleAuthButton() {
  const { loginWithGoogle, isLoading } = useAuth();

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full sm:w-auto flex items-center gap-2 rounded-full"
      onClick={loginWithGoogle}
      disabled={isLoading}
    >
      <Chrome className="w-5 h-5" />
      {isLoading ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
}
