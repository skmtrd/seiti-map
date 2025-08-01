import { getWorks } from "@/actions/work";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { CreateSpotButton } from "@/components/main/CreateSpotButton";
import { UserMenu } from "@/components/main/UserMenu";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "聖地巡礼マップ",
  description: "アニメ・映画・ドラマの聖地巡礼スポットを探索できるマップアプリ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const works = await getWorks();
  return (
    <div className="flex h-screen overflow-hidden">
      <Suspense>
        <Toolbar works={works} />
        <div className="flex-1">{children}</div>
      </Suspense>
      {/* 浮遊配置系ボタン */}
      <CreateSpotButton />

      <UserMenu />
    </div>
  );
}
