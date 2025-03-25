import "./globals.css";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    template: "%s – VoxNavi",
    default: "VoxNavi – Navigate your future, one answer at a time",
  },
  description: "An AI-powered platform for preparing for mock interviews.",
};

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export default async function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`pattern ${monaSans.className} antialiased`}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
