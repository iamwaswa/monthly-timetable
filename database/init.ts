// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export let firestore: ReturnType<typeof getFirestore>;

// Only initialize everything once
if (getApps().length === 0) {
  // Initialize Firebase
  const app = initializeApp();

  // Initialize Firestore
  firestore = getFirestore(app);
}
