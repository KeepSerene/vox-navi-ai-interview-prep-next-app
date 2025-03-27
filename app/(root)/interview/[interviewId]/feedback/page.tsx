import { fetchInterviewDetailsById } from "@/lib/data/interviews";
import { redirect } from "next/navigation";
import { getUserProfileFromSessionCookie } from "@/lib/actions/auth.actions";
import { fetchFeedbackByInterviewId } from "@/lib/data/feedback";

async function FeedbackPage({ params }: RouteParams) {
  const { interviewId } = await params;

  const interviewDetails = await fetchInterviewDetailsById(interviewId);

  if (!interviewDetails) redirect("/");

  const user = await getUserProfileFromSessionCookie();

  const feedback = await fetchFeedbackByInterviewId({
    interviewId,
    userId: user?.id!,
  });

  console.log(feedback);

  return <article>FeedbackPage</article>;
}

export default FeedbackPage;
