"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "@/constants";
import { adminDB } from "@/firebase/admin";

type GenerateFeedbackError = {
  code?: string;
  message: string;
};

export async function generateFeedbackAction(params: GenerateFeedbackParams) {
  const { interviewId, userId, transcript } = params;

  if (!interviewId || !userId || transcript.length === 0) {
    return {
      success: false,
      error: {
        code: "INVALID_INPUT",
        message: "Missing required parameters!",
      } as GenerateFeedbackError,
    };
  }

  try {
    const formattedTranscript = transcript
      .map(
        (message: { role: string; content: string }) =>
          `- ${message.role}: ${message.content}\n`
      )
      .join("");

    // Assess the candidate
    const {
      object: {
        totalScore,
        categories,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedbackDocRef = await adminDB.collection("feedback").add({
      interviewId,
      userId,
      totalScore,
      categories,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      feedbackId: feedbackDocRef.id,
    };
  } catch (err) {
    console.error("Error generating feedback", err);

    if (err instanceof Error) {
      return {
        success: false,
        error: {
          message: err.message,
          code: err.name === "Error" ? "UNKNOWN_ERROR" : err.name,
        } as GenerateFeedbackError,
      };
    }

    // Fallback for unexpected error types
    return {
      success: false,
      error: {
        message: "An unexpected error occurred!",
        code: "UNEXPECTED_ERROR",
      } as GenerateFeedbackError,
    };
  }
}
