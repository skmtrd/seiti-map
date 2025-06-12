import { PageBackButton } from "@/components/common/PageBackButton";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "聖地巡礼マップ",
  description: "アニメ・映画・ドラマの聖地巡礼スポットを探索できるマップアプリ",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      {children}
      <PageBackButton />
    </Suspense>
  );
}
