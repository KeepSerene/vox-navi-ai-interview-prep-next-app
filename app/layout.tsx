import "./globals.css";
import { Mona_Sans } from "next/font/google";
import type { Metadata } from "next";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoxNavi",
  description:
    "An AI-powered platform for preparing for mock interviews. Navigate your future, one answer at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased`}>{children}</body>
    </html>
  );
}
