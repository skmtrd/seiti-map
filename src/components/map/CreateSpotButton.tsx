"use client";

import { Button } from "@/components/ui/button";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import { Landmark } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateSpotButton() {
  const router = useRouter();

  const preventScroll = usePreventScroll({
    wheel: true,
    touch: true,
    keyboard: false,
  });

  const handleCreateSpot = () => {
    router.push("/create");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={preventScroll}>
      <Button onClick={handleCreateSpot} size="lg" variant="default">
        <Landmark className="h-6 w-6" />
        聖地を登録
      </Button>
    </div>
  );
}
