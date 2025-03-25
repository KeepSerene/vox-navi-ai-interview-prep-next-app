import type { Metadata } from "next";
import { getUserProfileFromSessionCookie } from "@/lib/actions/auth.actions";
import Agent from "@/components/Agent";

export const metadata: Metadata = {
  title: "Interview",
};

async function InterviewPage() {
  const user = await getUserProfileFromSessionCookie();

  return (
    <>
      <h3 className="capitalize mb-[2.5rem]">Interview generation</h3>

      <Agent type="generate" username={user?.name ?? "You"} userId={user?.id} />
    </>
  );
}

export default InterviewPage;
