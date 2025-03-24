"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { clientAuth } from "@/firebase/client";
import { signInAction, signUpAction } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import CustomFormField from "./CustomFormField";
import Link from "next/link";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  });
};

function AuthForm({ type }: { type: FormType }) {
  const router = useRouter();

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;

        // Client-side first
        // Creates the user in Firebase Authentication (using the client SDK)
        const userCredential = await createUserWithEmailAndPassword(
          clientAuth,
          email,
          password
        );

        // Then server-side
        // A server action that stores/saves additional user data in Firestore
        const result = await signUpAction({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);

          return;
        }

        toast.success(result?.message);
        router.push("/sign-in");
      } else {
        const { email, password } = values;

        // Client-side first (same as sign-up)
        const userCredential = await signInWithEmailAndPassword(
          clientAuth,
          email,
          password
        );

        // Firebase's temporary JWT
        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Login failed!");

          return;
        }

        // Then server-side
        const result = await signInAction({ email, idToken });

        if (!result.success) {
          toast.error(result.message);

          return;
        }

        toast.success(result.message);
        router.push("/");
      }
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "An unexpected error occurred!";
      console.error("Error:", errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="card-border lg:min-w-[566px]">
      <article className="card px-10 py-14 flex flex-col gap-6">
        <section className="flex justify-center gap-2">
          <Image src="/logo.svg" alt="VoxNavi Logo" width={38} height={32} />

          <h2 className="text-primary-100">VoxNavi</h2>
        </section>

        <h3 className="text-center">
          {type === "sign-up"
            ? "Step aboard! Your AI-powered interview journey begins here."
            : "Welcome back, navigator! Let's chart your next success."}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="form w-full space-y-6 mt-4"
          >
            {type === "sign-up" && (
              <CustomFormField
                name="name"
                control={form.control}
                label="Name"
                placeholder="Enter your name"
              />
            )}

            <CustomFormField
              inputType="email"
              name="email"
              control={form.control}
              label="Email"
              placeholder="Enter your email"
            />

            <CustomFormField
              inputType="password"
              name="password"
              control={form.control}
              label="Password"
              placeholder="Enter a strong password"
            />

            <Button type="submit" className="btn">
              {type === "sign-in" ? "Sign in" : "Create an account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          <span>
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <Link
            href={type === "sign-in" ? "/sign-up" : "sign-in"}
            className="text-user-primary font-bold ml-1"
          >
            {type === "sign-in" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </article>
    </div>
  );
}

export default AuthForm;
