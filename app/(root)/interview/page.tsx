import type { Metadata } from "next";
import { getUserProfileFromSessionCookie } from "@/lib/actions/auth.actions";
import InterviewAgent from "@/components/InterviewAgent";

export const metadata: Metadata = {
  title: "Generate & Conduct Interviews",
};

async function InterviewPage() {
  const user = await getUserProfileFromSessionCookie();

  return (
    <>
      <h3 className="capitalize mb-[2.5rem]">Interview generation</h3>

      <InterviewAgent
        type="generate"
        username={user?.name ?? "You"}
        userId={user?.id}
      />
    </>
  );
}

export default InterviewPage;
