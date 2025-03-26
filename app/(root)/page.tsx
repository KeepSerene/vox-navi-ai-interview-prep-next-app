import { getUserProfileFromSessionCookie } from "@/lib/actions/auth.actions";
import {
  fetchInterviewsByUserId,
  fetchLatestInterviews,
} from "@/lib/data/interviews";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import InterviewCard from "@/components/InterviewCard";

async function HomePage() {
  const user = await getUserProfileFromSessionCookie();
  const [userInterviews, latestInterviews] = await Promise.all([
    fetchInterviewsByUserId(user?.id),
    fetchLatestInterviews({ userId: user?.id }),
  ]);

  return (
    <>
      <div className="card-cta">
        <section className="max-w-lg max-lg:text-center flex flex-col gap-6">
          <h2>Chart Your Course to Interview Mastery with AI Guidance</h2>

          <p className="text-lg">
            Navigate through real interview challenges and receive instant,
            savvy feedback.
          </p>

          <Button asChild className="max-lg:w-full btn-primary">
            <Link href="/interview">Start an interview</Link>
          </Button>
        </section>

        <Image
          src="/robot.png"
          alt=""
          width={400}
          height={400}
          className="hidden lg:block"
        />
      </div>

      <section className="mt-8 flex flex-col gap-6">
        <h2>Your Interviews</h2>

        <>
          {userInterviews?.length > 0 ? (
            <ul role="list" className="interviews-section">
              {userInterviews.map((interview: Interview) => (
                <InterviewCard key={interview.id} {...interview} />
              ))}
            </ul>
          ) : (
            <p>You haven't taken any interviews yet!</p>
          )}
        </>
      </section>

      <section className="mt-8 flex flex-col gap-6">
        <h2>Set Sail on Your Interview Journey</h2>

        <>
          {latestInterviews?.length > 0 ? (
            <ul role="list" className="interviews-section">
              {latestInterviews.map((interview: Interview) => (
                <InterviewCard key={interview.id} {...interview} />
              ))}
            </ul>
          ) : (
            <p>There are no new interviews avaiable!</p>
          )}
        </>
      </section>
    </>
  );
}

export default HomePage;
