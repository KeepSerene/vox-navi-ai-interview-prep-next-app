interface Feedback {
  feedbackId: string;
  interviewId: string;
  totalScore: number;
  categories: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  interviewId: string;
  userId: string;
  interviewType: string;
  jobRole: string;
  experienceLevel: string;
  techStack: string[];
  questions: string[];
  createdAt: string;
  finalized: boolean;
}

interface GenerateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  interviewType: string;
  jobRole: string;
  techStack: string[];
  createdAt?: string;
  isSelfGenerated: boolean;
}

interface InterviewAgentProps {
  username: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface FetchFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface FetchLatestInterviewsParams {
  userId: string | undefined;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}
