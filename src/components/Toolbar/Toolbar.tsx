import { getWorks } from "@/app/actions/work";
import { SerchDrawerOpenButton } from "@/components/Toolbar/SerchDrawerOpenButton";
import { WorkSelector } from "@/components/Toolbar/WorkSelector";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import { Search } from "lucide-react";

export async function Toolbar() {
  const works = await getWorks();
  return (
    <>
      <div className="hidden w-96 rounded-4xl p-4 md:block">
        <div className="flex items-center justify-between">
          <WorkSelector works={works} />
        </div>
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <SerchDrawerOpenButton />
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
