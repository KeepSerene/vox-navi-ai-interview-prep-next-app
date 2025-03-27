import type { Metadata } from "next";
import { fetchInterviewDetailsById } from "@/lib/data/interviews";
import { redirect } from "next/navigation";
import { getUserProfileFromSessionCookie } from "@/lib/actions/auth.actions";
import { fetchFeedbackByInterviewId } from "@/lib/data/feedback";
import Image from "next/image";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Feedback",
};

async function FeedbackPage({ params }: RouteParams) {
  const { interviewId } = await params;

  const interviewDetails = await fetchInterviewDetailsById(interviewId);

  if (!interviewDetails) redirect("/");

  const user = await getUserProfileFromSessionCookie();

  const feedback = await fetchFeedbackByInterviewId({
    interviewId,
    userId: user?.id!,
  });

  const getFinalVerdict = (score: number): { text: string; color: string } => {
    if (score < 20) {
      return {
        text: "not recommended",
        color: "#f75353",
      };
    } else if (score >= 20 && score < 50) {
      return {
        text: "needs improvement",
        color: "#ffcc00",
      };
    } else if (score >= 50 && score < 80) {
      return {
        text: "recommended with reservations",
        color: "#ffcc00",
      };
    } else {
      return {
        text: "definitely recommended",
        color: "#49de50",
      };
    }
  };

  return (
    <>
      {feedback && (
        <article className="grid grid-cols-1 gap-[1.875rem]">
          <section className="justify-self-center border-b border-light-800 px-[5.625rem] pb-[1.875rem] grid grid-cols-1 gap-[1.875rem]">
            <h2 className="text-5xl">
              Feedback on the Interview&mdash;{interviewDetails.jobRole}
            </h2>

            <div className="text-xl mx-auto flex items-center gap-[2.5rem]">
              <div className="flex items-center gap-1">
                <Image src="/star.svg" alt="" width={22} height={22} />

                <p className="capitalize">
                  Overall impression:{" "}
                  <span className="text-primary font-semibold">
                    {feedback.totalScore}
                  </span>
                  /100
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Image src="/calendar.svg" alt="" width={22} height={22} />

                <p>
                  <span>{dayjs(feedback.createdAt).format("MMM D, YYYY")}</span>
                  &nbsp;&ndash;&nbsp;
                  <span>{dayjs(feedback.createdAt).format("h:mm A")}</span>
                </p>
              </div>
            </div>
          </section>

          {/* Final assessment */}
          <p className="px-[5.625rem]">{feedback.finalAssessment}</p>

          {/* Categories */}
          <section className="px-[5.625rem] grid grid-cols-1 gap-5">
            <h2 className="text-[2rem]">Breakdown of Evaluation</h2>

            <ul role="list" className="grid grid-cols-1 gap-2">
              {feedback.categories.map(({ name, score, comment }, index) => (
                <li key={index} className="grid grid-cols-1 gap-1">
                  <p className="text-lg font-semibold">
                    {index + 1}.&nbsp;&nbsp;{name}&nbsp;({score}/100)
                  </p>

                  <p className="ml-6 flex items-start gap-2">
                    <span>&#8226;</span>

                    <span>{comment}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Areas for improvement */}
          {feedback.areasForImprovement.length > 0 && (
            <section className="px-[5.625rem] grid grid-cols-1 gap-5">
              <h2 className="text-[2rem]">Areas for Improvement</h2>

              <ul role="list" className="grid grid-cols-1 gap-2">
                {feedback.areasForImprovement.map((scope) => (
                  <li key={scope}>
                    &#8226;&nbsp;&nbsp;<span>{scope}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Strengths */}
          {feedback.strengths.length > 0 && (
            <section className="px-[5.625rem] grid grid-cols-1 gap-5">
              <h2 className="text-[2rem]">Strengths</h2>

              <ul role="list" className="grid grid-cols-1 gap-2">
                {feedback.strengths.map((strength) => (
                  <li key={strength}>
                    &#8226;&nbsp;&nbsp;<span>{strength}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Final verdict */}
          <section className="px-[5.625rem] flex flex-col md:flex-row md:justify-between md:items-center max-md:gap-5">
            <h2 className="capitalize">Final verdict</h2>

            <p
              style={{ color: getFinalVerdict(feedback.totalScore).color }}
              className="w-max bg-dark-200 text-lg font-semibold capitalize rounded-full px-4 py-2"
            >
              {getFinalVerdict(feedback.totalScore).text}
            </p>
          </section>

          {/* Action buttons */}
          <div className="px-[5.625rem] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button type="button" asChild className="btn-secondary w-full">
              <Link href="/">Go home</Link>
            </Button>

            <Button type="button" asChild className="btn-primary w-full">
              <Link href={`/interview/${interviewId}`}>Retake interview</Link>
            </Button>
          </div>
        </article>
      )}
    </>
  );
}

export default FeedbackPage;
