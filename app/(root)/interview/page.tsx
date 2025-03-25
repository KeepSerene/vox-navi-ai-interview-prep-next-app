import type { Metadata } from "next";
import Agent from "@/components/Agent";

const metadata: Metadata = {
  title: "Interview",
};

function InterviewPage() {
  return (
    <>
      <h3 className="capitalize mb-[2.5rem]">Interview generation</h3>

      <Agent type="generate" username="You" userId="user1" />
    </>
  );
}

export default InterviewPage;
