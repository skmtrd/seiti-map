"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CreateSpotButton() {
  const router = useRouter();

  const handleCreateSpot = () => {
    router.push("/create");
  };

  return (
    <div className="absolute bottom-10 right-6 z-10">
      <Button onClick={handleCreateSpot} size="lg" variant="outline">
        新しく聖地を作成する
      </Button>
    </div>
  );
}
