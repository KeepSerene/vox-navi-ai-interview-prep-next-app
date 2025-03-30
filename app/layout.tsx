import "./globals.css";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    template: "%s – VoxNavi",
    default: "VoxNavi – Navigate your future, one answer at a time",
  },
  description:
    "Practice interviews with an AI voice assistant. Get personalized feedback, improve your skills, and ace your next job interview with VoxNavi.",
  keywords:
    "interview preparation, AI interview, mock interview, job preparation, voice assistant, interview practice, interview feedback",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://vox-navi.vercel.app/",
    title: "VoxNavi | AI-Powered Interview Preparation",
    description:
      "Practice tech interviews with an AI voice assistant. Get personalized feedback and improve your skills.",
    images: [
      {
        url: "/public/vox-navi-home.png",
        width: 1200,
        height: 630,
        alt: "VoxNavi Interview Preparation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoxNavi | AI-Powered Interview Preparation",
    description:
      "Practice tech interviews with an AI voice assistant. Get personalized feedback and improve your skills.",
    images: ["/public/vox-navi-home.png"],
  },
  authors: [{ name: "Dhrubajyoti Bhattacharjee" }],
  themeColor: "#08090D",
  icons: {
    icon: "/favicon.ico",
  },
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
