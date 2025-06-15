"use client";

import { Button } from "@/components/ui/button";
import { useGetUser } from "@/hooks/SWR/useGetUser";
import { usePreventScroll } from "@/hooks/common/usePreventScroll";
import { MessageCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import LoginModal from "../common/LoginModal";

export function CreateCommentButton() {
  const pathname = usePathname();
  const spotId = pathname.split("/")[2];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const router = useRouter();

  const preventScroll = usePreventScroll({
    wheel: true,
    touch: true,
    keyboard: false,
  });

  const { user } = useGetUser();

  const handleCreateComment = (bool: boolean) => {
    if (!bool) {
      setIsModalOpen(false);
      return;
    }
    if (user) {
      router.push(`/spot/${spotId}/comments/?lat=${lat}&lng=${lng}`);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <LoginModal
      isOpen={isModalOpen}
      setIsOpen={handleCreateComment}
      title="コメント投稿にはログインが必要です"
      trigger={
        <div className="fixed right-4 bottom-4 z-50" ref={preventScroll}>
          <Button size="lg" variant="default">
            <MessageCircle className="h-6 w-6" />
            コメントを投稿
          </Button>
        </div>
      }
    />
  );
}
