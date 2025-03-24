import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
};

function SignInPage() {
  return <AuthForm type="sign-in" />;
}

export default SignInPage;
