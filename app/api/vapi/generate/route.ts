import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCoverImg } from "@/lib/utils";
import { adminDB } from "@/firebase/admin";

// Health check route handler
// Responds with a simple success message when a GET request is made
export async function GET() {
  return Response.json(
    {
      success: true,
      message: "Interview Generation API is operational!",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

// Interview generation route handler (Vapi AI assistant will make this post request! See Vapi's workflow)
// Processes POST requests to generate interview questions and store interview details
export async function POST(request: Request) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, error: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    const requestBody = await request.json();

    const {
      interviewType,
      jobRole,
      experienceLevel,
      techStack,
      questionCount,
      userId,
    } = requestBody;

    // Validate required fields
    const missingFields = [
      "interviewType",
      "jobRole",
      "experienceLevel",
      "techStack",
      "questionCount",
      "userId",
    ].filter((field) => !requestBody[field]);

    if (missingFields.length > 0) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields!",
          missingFields,
        },
        { status: 400 }
      );
    }

    // Generate interview questions using Gemini
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

    // Prepare interview object for database storage
    const interview = {
      interviewType,
      jobRole,
      experienceLevel,
      techStack: techStack.split(","),
      questionCount,
      questions: JSON.parse(questions),
      userId,
      coverImageURL: getRandomInterviewCoverImg(),
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    // Store interview
    const docRef = await adminDB.collection("interviews").add(interview);

    // Return a success response with the generated interview ID
    return Response.json(
      {
        success: true,
        message: "Interview generated successfully",
        interviewId: docRef.id,
      },
      { status: 201 }
    );
  } catch (err) {
    // Detailed error logging and response
    console.error("Interview Generation Error:", err);

    // Differentiate between various error types
    if (err instanceof SyntaxError) {
      return Response.json(
        {
          success: false,
          error: "Invalid JSON in request body!",
        },
        { status: 400 }
      );
    }

    // Generic server error for unexpected issues
    return Response.json(
      {
        success: false,
        error: "Internal Server Error",
        details:
          err instanceof Error ? err.message : "An unknown error occurred!",
      },
      { status: 500 }
    );
  }
}
