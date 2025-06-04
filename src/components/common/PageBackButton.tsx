"use client";

import { Button } from "@/components/ui/button";
import { ChevronsLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function PageBackButton() {
  const router = useRouter();

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button onClick={() => router.back()} size="icon" variant="default">
        <ChevronsLeft className="h-6 w-6" />
      </Button>
    </div>
  );
}
