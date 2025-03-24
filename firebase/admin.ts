// Runs on the server (in Next.js Server Components and Server Actions)
// Reference: https://firebase.google.com/docs/admin/setup?hl=en&authuser=0#set-up-project-and-service-account

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initFirebaseAdmin() {
  const apps = getApps();

  if (apps.length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  return {
    adminAuth: getAuth(),
    adminDB: getFirestore(),
  };
}

export const { adminAuth, adminDB } = initFirebaseAdmin();
