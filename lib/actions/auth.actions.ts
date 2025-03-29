"use server";

// Server actions using the admin SDK

import { adminAuth, adminDB } from "@/firebase/admin";
import { FirebaseError } from "firebase/app";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUpAction(params: SignUpParams) {
  const { uid, name, email, password } = params;

  try {
    const userRecord = await adminDB.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message:
          "A user with the given credentials already exists! Please sign in instead.",
      };
    }

    await adminDB.collection("users").doc(uid).set({
      name,
      email,
      password,
    });

    return {
      success: true,
      message: "Account created successfully! Please sign in.",
    };
  } catch (err) {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/email-already-exists":
          return {
            success: false,
            message: "The email is already in use!",
          };
        default:
          return {
            success: false,
            message: err.message,
          };
      }
    }

    // Fallback for non-Firebase errors
    const errMsg =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while signing up the user!";

    console.error("Sign-up Action Error:", errMsg);

    return {
      success: false,
      message: errMsg,
    };
  }
}

async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies(); // Gives access to the cookie storage

  // Convert a temporary Firebase ID token (a JWT) into a longer-lived session cookie
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // in ms
  });

  // Store the cookie with various security options
  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK, // in secs, The cookie expires after one week, prompting the user to sign in after a week
    httpOnly: true, // Prevents client-side JS from accessing the cookie, enhancing security against XSS attacks
    secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
    path: "/", // Cookie is available across the entire site
    // Allows cookies to be sent when users navigate to the site from external links, cross-site requests
    // Provides protection against CSRF attacks by controlling cross-site cookie sending
    sameSite: "lax",
  });
}

export async function signInAction(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await adminAuth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message:
          "No user exists with the given email! Create an account instead.",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully!",
    };
  } catch (err) {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/user-not-found":
          return {
            success: false,
            message: "No account found with this email! Please sign up.",
          };
        case "auth/invalid-email":
          return {
            success: false,
            message: "Invalid email format! Please check and try again.",
          };
        case "auth/invalid-credential":
          return {
            success: false,
            message:
              "Invalid credentials! Please check your email and password.",
          };
        case "auth/too-many-requests":
          return {
            success: false,
            message: "Too many login attempts! Please try again later.",
          };
        default:
          console.error("Unhandled Firebase Error:", err);

          return {
            success: false,
            message:
              err.message ||
              "An unexpected Firebase authentication error occurred!",
          };
      }
    }

    // Handle other types of errors
    const errMsg =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while signing in the user!";

    console.error("Sign-in Action Error:", errMsg);

    return {
      success: false,
      message: errMsg,
    };
  }
}

export async function getUserProfileFromSessionCookie(): Promise<User | null> {
  // Retrieve the cookie store from Next.js server-side cookies
  const cookieStore = await cookies();
  // Extract the session cookie value if it exists
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    // Verify the session cookie with Firebase Admin SDK
    // The 'true' parameter checks the cookie's expiration
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    // Fetch the user document from Firestore using the UID from the decoded session
    const userRecord = await adminDB
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    // Return the user data, spreading the document fields and adding the document ID
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (err) {
    // Firebase Authentication errors
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/invalid-session-cookie":
          console.warn(
            "Invalid session cookie! User may need to re-authenticate."
          );

          return null;

        case "auth/session-cookie-expired":
          console.warn(
            "Session cookie has expired! User needs to log in again."
          );

          return null;

        case "auth/user-token-revoked":
          console.warn(
            "User's token has been revoked! Forcing re-authentication."
          );

          return null;

        default:
          console.error("Unhandled Firebase Authentication Error:", err);
          return null;
      }
    }

    // Firestore-related errors
    if (err instanceof Error && err.name === "FirestoreError") {
      console.error("Firestore Error when fetching user:", err.message);

      return null;
    }

    // Fallback for unexpected errors
    const errorMessage =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while fetching the current user!";

    console.error("Unexpected error in getCurrentUser:", errorMessage);

    return null;
  }
}

export async function isUserAuthenticated() {
  const userProfile = await getUserProfileFromSessionCookie();

  return Boolean(userProfile);
}

export async function signOutAction(params: { userId: string }) {
  const { userId } = params;

  if (!userId) {
    return {
      success: false,
      message: "No user ID provided!",
    };
  }

  try {
    // Delete all feedback associated with the current user
    const currentUserFeedbackSnapshot = await adminDB
      .collection("feedback")
      .where("userId", "==", userId)
      .get();
    const feedbackDeletionPromises = currentUserFeedbackSnapshot.docs.map(
      async (feedbackDoc) => {
        adminDB.collection("feedback").doc(feedbackDoc.id).delete();
      }
    );

    // Delete all interviews associated with the current user
    const currentUserInterviewsSnapshot = await adminDB
      .collection("interviews")
      .where("userId", "==", userId)
      .get();
    const interviewsDeletionPromises = currentUserInterviewsSnapshot.docs.map(
      (interviewDoc) => {
        adminDB.collection("interviews").doc(interviewDoc.id).delete();
      }
    );

    // Delete the current user from the users collection stored in Firestore
    const userDeletionPromise = await adminDB
      .collection("users")
      .doc(userId)
      .delete();

    // Execute all deletions in paraller
    await Promise.all([
      ...feedbackDeletionPromises,
      ...interviewsDeletionPromises,
      userDeletionPromise,
    ]);

    // Delete the session cookie
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return {
      success: true,
      message: "Account and all associated data successfully deleted!",
    };
  } catch (err) {
    if (err instanceof FirebaseError) {
      console.error("Firebase Error during sign-out:", err);

      return {
        success: false,
        message: err.message || "An error occurred while signing out!",
      };
    }

    const errMsg =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while signing out!";

    console.error("Sign-out Action Error:", errMsg);

    return {
      success: false,
      message: errMsg,
    };
  }
}
