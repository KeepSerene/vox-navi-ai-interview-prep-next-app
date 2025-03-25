import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { adminDB } from "@/firebase/admin";

export async function GET() {
  return Response.json({ success: true, data: "Thank You!" }, { status: 200 });
}

export async function POST(request: Response) {
  const {
    interviewType,
    jobRole,
    experienceLevel,
    techStack,
    questionCount,
    userId,
  } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `
        Prepare questions for a job interview.
        The job role is ${jobRole}.
        The job experience level is ${experienceLevel}.
        The tech stack used in the job is: ${techStack}.
        The focus between behavioural and technical questions should lean towards: ${interviewType}.
        The amount of questions required is: ${questionCount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const interview = {
      interviewType,
      jobRole,
      experienceLevel,
      techStack: techStack.split(","),
      questionCount,
      questions: JSON.parse(questions),
      userId,
      coverImageURL: getRandomInterviewCover(),
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    await adminDB.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);

    return Response.json({ success: false, error: err }, { status: 500 });
  }
}
