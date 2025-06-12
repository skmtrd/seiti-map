"use client";

import { Button } from "@/components/ui/button";
import { useGetUser } from "@/hooks/SWR/useGetUser";
import { usePreventScroll } from "@/hooks/common/usePreventScroll";
import { Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginModal from "../common/LoginModal";

export function CreateSpotButton() {
  const router = useRouter();
  const { user, mutate } = useGetUser();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const preventScroll = usePreventScroll({
    wheel: true,
    touch: true,
    keyboard: false,
  });

  const handleCreateSpot = (bool: boolean) => {
    if (!bool) {
      setIsModalOpen(false);
      return;
    }
    if (user) {
      router.push("/create");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <LoginModal
      isOpen={isModalOpen}
      setIsOpen={handleCreateSpot}
      trigger={
        <div className="fixed right-4 bottom-4 z-50" ref={preventScroll}>
          <Button size="lg" variant="default">
            <Landmark className="h-6 w-6" />
            聖地を登録
          </Button>
        </div>
      }
    />
  );
}
