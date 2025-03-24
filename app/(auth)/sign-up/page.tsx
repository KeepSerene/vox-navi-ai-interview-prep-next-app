import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign up",
};

function SignUpPage() {
  return <AuthForm type="sign-up" />;
}

export default SignUpPage;
