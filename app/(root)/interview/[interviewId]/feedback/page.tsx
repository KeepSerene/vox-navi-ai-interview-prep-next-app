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
        <article className="grid grid-cols-1 gap-4 sm:gap-[1.875rem]">
          <section className="feedback-page-wrapper justify-self-center border-b border-light-800 pb-[1.875rem] grid grid-cols-1 gap-[1.875rem]">
            <h2 className="feedback-page-header">
              Feedback on the Interview&mdash;{interviewDetails.jobRole}
            </h2>

            <div className="md:text-lg lg:text-xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-[2.5rem]">
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
          <p className="feedback-page-wrapper text-sm md:text-[1rem]">
            {feedback.finalAssessment}
          </p>

          {/* Categories */}
          <section className="feedback-page-wrapper grid grid-cols-1 gap-3 md:gap-5">
            <h4 className="feedback-page-subheader">Breakdown of Evaluation</h4>

            <ul role="list" className="grid grid-cols-1 gap-2">
              {feedback.categories.map(({ name, score, comment }, index) => (
                <li key={index} className="grid grid-cols-1 gap-1">
                  <p className="md:text-lg font-semibold">
                    {index + 1}.&nbsp;&nbsp;{name}&nbsp;({score}/100)
                  </p>

                  <p className="feedback-page-bullet ml-4 md:ml-6 flex items-start gap-2">
                    <span>&#8226;</span>

                    <span>{comment}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Areas for improvement */}
          <>
            {feedback.areasForImprovement.length > 0 && (
              <section className="feedback-page-wrapper grid grid-cols-1 gap-3 md:gap-5">
                <h4 className="feedback-page-subheader">
                  Areas for Improvement
                </h4>

                <ul role="list" className="grid grid-cols-1 gap-2">
                  {feedback.areasForImprovement.map((scope) => (
                    <li key={scope} className="feedback-page-bullet">
                      &#8226;&nbsp;&nbsp;<span>{scope}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>

          {/* Strengths */}
          <>
            {feedback.strengths.length > 0 && (
              <section className="feedback-page-wrapper grid grid-cols-1 gap-3 md:gap-5">
                <h4 className="feedback-page-subheader">Strengths</h4>

                <ul role="list" className="grid grid-cols-1 gap-2">
                  {feedback.strengths.map((strength) => (
                    <li key={strength} className="feedback-page-bullet">
                      &#8226;&nbsp;&nbsp;<span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>

          {/* Final verdict */}
          <section className="feedback-page-wrapper flex justify-between items-center">
            <h4 className="feedback-page-subheader capitalize">
              Final verdict
            </h4>

            <p
              style={{ color: getFinalVerdict(feedback.totalScore).color }}
              className="w-max bg-dark-200 text-sm md:text-lg font-semibold capitalize rounded-full px-2 py-1 md:px-4 md:py-2"
            >
              {getFinalVerdict(feedback.totalScore).text}
            </p>
          </section>

          {/* Action buttons */}
          <div className="feedback-page-wrapper mt-6 md:mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
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
