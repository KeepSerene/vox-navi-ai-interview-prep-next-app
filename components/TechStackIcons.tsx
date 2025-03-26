import Image from "next/image";
import { cn, getTechStackLogos } from "@/lib/utils";

async function TechStackIcons({ techStack }: TechIconProps) {
  const techStackIcons = await getTechStackLogos(techStack);

  return (
    <ul role="list" className="flex">
      {techStackIcons.slice(0, 3).map(({ tech, url }, index) => (
        <li
          key={index}
          className={cn(
            "group bg-dark-300 rounded-full p-2 flex-center relative",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>

          <Image
            src={url}
            alt={`${tech} icon`}
            width={100}
            height={100}
            className="size-5"
          />
        </li>
      ))}
    </ul>
  );
}

export default TechStackIcons;
