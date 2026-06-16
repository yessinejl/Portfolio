import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA4Y23QGDNDs-uXSyn167ipI0ksryeXgeU",
  authDomain: "portfolio-72bce.firebaseapp.com",
  projectId: "portfolio-72bce",
  storageBucket: "portfolio-72bce.firebasestorage.app", // testing the standard format
  messagingSenderId: "340456710435",
  appId: "1:340456710435:web:3a14e6e736d53bc0f7ac96"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testUpload() {
  console.log("Starting upload test...");
  try {
    const storageRef = ref(storage, "test.txt");
    await uploadString(storageRef, "Hello World");
    const url = await getDownloadURL(storageRef);
    console.log("Success! URL:", url);
  } catch (error) {
    console.error("Upload failed:", error.code, error.message);
  }
  process.exit();
}

testUpload();
