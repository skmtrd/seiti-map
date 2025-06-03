"use client";

import { Button } from "@/components/ui/button";
import { Landmark } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateSpotButton() {
  const router = useRouter();

  const handleCreateSpot = () => {
    router.push("/create");
  };

  return (
    <div className="fixed bottom-10 right-6 z-50">
      <Button onClick={handleCreateSpot} size="lg" variant="default">
        <Landmark className="h-6 w-6" />
        新しく聖地を登録する
      </Button>
    </div>
  );
}
