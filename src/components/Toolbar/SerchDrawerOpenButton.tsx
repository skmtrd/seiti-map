"use client";

import { Button } from "@/components/ui/button";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import { Search } from "lucide-react";

export function SerchDrawerOpenButton() {
  const preventScroll = usePreventScroll({
    wheel: true,
    touch: true,
    keyboard: false,
  });

  return (
    <div className="fixed bottom-25 right-6 z-50" ref={preventScroll}>
      <Button size="icon" variant="default" className="shadow-lg">
        <Search className="h-6 w-6" />
      </Button>
    </div>
  );
}
