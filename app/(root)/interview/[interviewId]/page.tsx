import type { Metadata } from "next";
import { getUserProfileFromSessionCookie } from "@/lib/actions/auth.actions";
import { fetchInterviewDetailsById } from "@/lib/data/interviews";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getRandomInterviewCoverImg } from "@/lib/utils";
import TechStackIcons from "@/components/TechStackIcons";
import InterviewAgent from "@/components/InterviewAgent";

export const metadata: Metadata = {
  title: "Conduct Interview",
};

async function InterviewDetailsPage({ params }: RouteParams) {
  const { interviewId } = await params;
  const user = await getUserProfileFromSessionCookie();
  const interviewDetails = await fetchInterviewDetailsById(interviewId);

  if (!interviewDetails) {
    redirect("/");
  }

  return (
    <>
      <div className="mb-[2.5rem] flex justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <section className="flex items-center gap-4">
            <Image
              src={getRandomInterviewCoverImg()}
              alt=""
              width={40}
              height={40}
              className="size-[40px] object-cover rounded-full"
            />

            <h3 className="capitalize">{interviewDetails.jobRole} interview</h3>
          </section>

          <TechStackIcons techStack={interviewDetails.techStack} />
        </div>

        <p className="h-fit bg-dark-200 capitalize rounded-lg px-4 py-2">
          {interviewDetails.interviewType}
        </p>
      </div>

      <InterviewAgent
        type="interview"
        username={user?.name ?? "User"}
        userId={user?.id}
        interviewId={interviewId}
        questions={interviewDetails.questions}
      />
    </>
  );
}

export default InterviewDetailsPage;
