"use client";

import { usePageView } from "@/hooks/common/usePageView";
import type React from "react";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  // ページビュー追跡を有効化
  usePageView();

  return <>{children}</>;
};

export default AnalyticsProvider;
