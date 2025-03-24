import dayjs from "dayjs";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import TechStackIcons from "./TechStackIcons";

function InterviewCard({
  interviewId,
  userId,
  role,
  type,
  techStack,
  createdAt,
}: InterviewCardProps) {
  const feedback = null as Feedback | null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <li className="card-border w-full sm:w-[360px] min-h-96 relative">
      <div className="card-interview">
        <div className="">
          <div className="w-fit bg-light-600 rounded-bl-lg px-4 py-2 absolute top-0 right-0">
            <p className="badge-text">{normalizedType}</p>
          </div>

          {/* Company */}
          <Image
            src={getRandomInterviewCover()}
            alt="Company"
            width={90}
            height={90}
            className="size-[90px] rounded-full object-cover"
          />

          <h3 className="capitalize mt-5">{role} Interview</h3>

          <div className="mt-3 flex gap-5">
            <div className="flex items-center gap-2">
              <Image src="/calendar.svg" alt="" width={22} height={22} />

              <p>{formattedDate}</p>
            </div>

            <div className="flex items-center gap-2">
              <Image src="/star.svg" alt="" width={22} height={22} />

              <p>
                {feedback?.totalScore ? `${feedback?.totalScore}/100` : "N/A"}
              </p>
            </div>
          </div>

          <p className="lineclamp">
            {feedback?.finalAssessment ||
              "You haven't taken an interview yet! Take one now to improve your skills"}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <TechStackIcons techStack={techStack} />

          <Button className="btn-primary asChild">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "Check feedback" : "View interview"}
            </Link>
          </Button>
        </div>
      </div>
    </li>
  );
}

export default InterviewCard;
