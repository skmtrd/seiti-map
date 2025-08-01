"use client";

import { MultiWorkSelector } from "@/components/Toolbar/MultiWorkSelector";
import { WorkTypeSelector } from "@/components/Toolbar/WorkTypeSelector";
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
import { SearchDrawerOpenButton } from "./SearchDrawerOpenButton";

export function Toolbar({ works }: { works: Work[] }) {
  const preventScroll = usePreventScroll({
    wheel: true,
    touch: true,
    keyboard: false,
  });
  return (
    <>
      <div className="hidden w-96 rounded-4xl p-4 md:block">
        <div className="flex flex-col items-center justify-between gap-4">
          <WorkTypeSelector />
          <MultiWorkSelector works={works} />
        </div>
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <div ref={preventScroll}>
            <SearchDrawerOpenButton />
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Search className="h-6 w-6" />
              聖地を検索する
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex h-screen w-full flex-col items-center gap-4 px-4">
            <WorkTypeSelector />
            <MultiWorkSelector works={works} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
