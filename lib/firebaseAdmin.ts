import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Verifying Firebase ID tokens only needs the project ID; no service account is required.
// When FIREBASE_AUTH_EMULATOR_HOST is set, firebase-admin talks to the local Auth emulator.
const app =
    getApps()[0] ??
    initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

export const adminAuth = getAuth(app);
