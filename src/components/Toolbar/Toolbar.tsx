"use client";

import { WorkSelector } from "@/components/Toolbar/WorkSelector";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { usePreventScroll } from "@/hooks/common/usePreventScroll";
import type { Work } from "@/types/database";
import { Search } from "lucide-react";

export function Toolbar({ works }: { works: Work[] }) {
  const preventScroll = usePreventScroll({
    wheel: true,
    touch: true,
    keyboard: false,
  });
  return (
    <>
      <div className="hidden w-96 rounded-4xl p-4 md:block">
        <div className="flex items-center justify-between">
          <WorkSelector works={works} />
        </div>
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <div ref={preventScroll}>
            <Button
              size="icon"
              variant="default"
              className="md:hidden fixed bottom-17 right-4 z-50"
            >
              <Search className="h-6 w-6" />
            </Button>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Search className="h-6 w-6" />
              聖地を検索する
            </DrawerTitle>
          </DrawerHeader>
          <div className="w-full h-screen flex flex-col items-center px-4">
            <WorkSelector works={works} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
