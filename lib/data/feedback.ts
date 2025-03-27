"use server";

import { adminDB } from "@/firebase/admin";

export async function fetchFeedbackByInterviewId(
  params: FetchFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  if (!(interviewId && userId)) {
    console.warn(
      "Attempted to fetch feedback with undefined interview and/or user ID/IDs!"
    );

    return null;
  }

  try {
    const snapshot = await adminDB
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log(`No feedback found for interview ${interviewId}`);

      return null;
    }

    const feedbackDoc = snapshot.docs[0];

    return {
      feedbackId: feedbackDoc.id,
      ...feedbackDoc.data(),
    } as Feedback;
  } catch (err) {
    console.error(`Error fetching feedback for interview ${interviewId}:`, err);

    return null;
  }
}
