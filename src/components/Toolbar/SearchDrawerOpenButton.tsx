"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchDrawerOpenButton() {
  return (
    <Button size="icon" variant="default" className="fixed right-4 bottom-17 z-50 md:hidden">
      <Search className="h-6 w-6" />
    </Button>
  );
}
