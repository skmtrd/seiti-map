"use client";

import { pageview } from "@/lib/gtag";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const usePageView = () => {
  const pathname = usePathname();

  useEffect(() => {
    // URLが変更された時にページビューを送信
    pageview(pathname);
  }, [pathname]);
};
