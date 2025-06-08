"use client";

import { Button } from "@/components/ui/button";
import { usePreventScroll } from "@/hooks/common/usePreventScroll";
import { MessageCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function CreateCommentButton() {
  const pathname = usePathname();
  const spotId = pathname.split("/")[1];

  const router = useRouter();

  const preventScroll = usePreventScroll({
    wheel: true,
    touch: true,
    keyboard: false,
  });

  const handleCreateSpot = () => {
    router.push(`/${spotId}/comments`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={preventScroll}>
      <Button onClick={handleCreateSpot} size="lg" variant="default">
        <MessageCircle className="h-6 w-6" />
        コメントを投稿
      </Button>
    </div>
  );
}
