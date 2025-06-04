"use client";

import { Button } from "@/components/ui/button";
import { usePreventScroll } from "@/hooks/common/usePreventScroll";
import { Search } from "lucide-react";

export function SearchDrawerOpenButton() {
  return (
    <Button size="icon" variant="default" className="md:hidden fixed bottom-17 right-4 z-50">
      <Search className="h-6 w-6" />
    </Button>
  );
}
