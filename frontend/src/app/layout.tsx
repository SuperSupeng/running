import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "跑步打卡 - 记录你的跑步之旅",
  description: "一个简单易用的跑步记录和排行榜应用，帮助跑友记录每日跑步距离，通过排行榜激励持续运动。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
