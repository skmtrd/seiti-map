import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getWorks } from "@/actions/work";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { CreateSpotButton } from "@/components/main/CreateSpotButton";
import { UserMenu } from "@/components/main/UserMenu";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <div className="flex h-screen">
      <Suspense>
        <Toolbar works={works} />
      </Suspense>
      <div className="flex-1">{children}</div>
      {/* 浮遊配置系ボタン */}
      <CreateSpotButton />
      <UserMenu />
    </div>
  );
}
