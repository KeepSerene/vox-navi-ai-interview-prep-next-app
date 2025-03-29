"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { Button } from "./ui/button";

type SignOutModalProps = {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
};

function SignOutModal({ isOpen, userId, onClose }: SignOutModalProps) {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      const result = await signOutAction({ userId });

      if (result.success) {
        router.push("/sign-up");
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Unknown Error:", err);
      toast.error("An unknown error occured! Please try again...");
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-out-modal-title"
      aria-describedby="sign-out-modal-desc"
      className="bg-black/50 fixed inset-0 z-[9999] flex justify-center items-center"
    >
      <section
        onClick={(event) => {
          event.stopPropagation();
        }}
        role="document"
        className="max-w-md w-full bg-dark-300 rounded-[0.75rem] md:rounded-[1rem] p-4 md:p-0 md:px-8 md:py-4 mx-8 grid grid-cols-1 gap-4"
      >
        <h2
          id="sign-out-modal-title"
          className="text-xl md:text-2xl capitalize text-center"
        >
          Sign out confirmation
        </h2>

        <p id="sign-out-modal-desc" className="text-center md:text-left">
          Are you sure you want to sign out? This will permanently delete all
          your interviews, feedback, and account information. This action cannot
          be undone!
        </p>

        <div className="flex flex-col md:flex-row md:justify-end items-center gap-4">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cancel sign-out and close modal"
            className="btn-primary max-md:w-full"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSignOut}
            disabled={isLoading}
            aria-label="Confirm sign-out and delete all data"
            className="btn-disconnect max-md:w-full rounded-full"
          >
            {isLoading ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  role="status"
                  aria-hidden="true"
                  className="size-4 animate-spin"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>

                <span>Processing...</span>
              </>
            ) : (
              "Sign-out & delete data"
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default SignOutModal;
