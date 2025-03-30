import type { Metadata } from "next";
import { getUserProfileFromSessionCookie } from "@/lib/actions/auth.actions";
import InterviewAgent from "@/components/InterviewAgent";

export const metadata: Metadata = {
  title: "Generate Interview",
};

async function InterviewGenerationPage() {
  const user = await getUserProfileFromSessionCookie();

  return (
    <>
      <h3 className="capitalize mb-[2.5rem]">Generate interview</h3>

      <InterviewAgent
        type="generate"
        username={user?.name ?? "User"}
        userId={user?.id}
      />
    </>
  );
}

export default InterviewGenerationPage;
