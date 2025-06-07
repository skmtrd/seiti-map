import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "聖地巡礼マップ",
  description: "アニメ・映画・ドラマの聖地巡礼スポットを探索できるマップアプリ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
