// Import the functions you need from the SDKs you need
import { credential } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export let firestore: ReturnType<typeof getFirestore>;

// Only initialize everything once
if (getApps().length === 0) {
  // Initialize Firebase
  const app = initializeApp({
    credential: credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  // Initialize Firestore
  firestore = getFirestore(app);
}
