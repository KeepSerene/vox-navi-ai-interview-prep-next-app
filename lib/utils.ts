import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { interviewCovers, techStackMap } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techStackIconsBaseURL =
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechStackName = (techName: string) => {
  const key = techName.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");

  return techStackMap[key as keyof typeof techStackMap];
};

const iconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });

    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechStackLogos = async (techStack: string[]) => {
  const logoURLs = techStack.map((tech) => {
    const normalizedName = normalizeTechStackName(tech);

    return {
      tech,
      url: `${techStackIconsBaseURL}/${normalizedName}/${normalizedName}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await iconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCoverImg = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);

  return `/covers${interviewCovers[randomIndex]}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length === 0) return text;

  if (text.length > maxLength) return `${text.slice(0, maxLength + 1)}...`;

  return text;
};
