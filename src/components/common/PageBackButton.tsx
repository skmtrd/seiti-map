"use client";

import { Button } from "@/components/ui/button";
import { ChevronsLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function PageBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isSpotPage = pathname.includes("/spot/") && !pathname.includes("/comments");
  const isCreateSpotPage = pathname.includes("/create");

  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const spotId = pathname.split("/")[2];

  const handleClick = () => {
    if (isSpotPage) {
      router.push(`/?lat=${lat}&lng=${lng}&open=${spotId}`);
    } else if (isCreateSpotPage) {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button onClick={handleClick} size="icon" variant="default">
        <ChevronsLeft className="h-6 w-6" />
      </Button>
    </div>
  );
}
