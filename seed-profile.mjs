import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4Y23QGDNDs-uXSyn167ipI0ksryeXgeU",
  authDomain: "portfolio-72bce.firebaseapp.com",
  projectId: "portfolio-72bce",
  storageBucket: "portfolio-72bce.firebasestorage.app",
  messagingSenderId: "340456710435",
  appId: "1:340456710435:web:3a14e6e736d53bc0f7ac96"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const profile = {
  name: 'Yassine Jlassia',
  title: 'Développeur Full-Stack',
  email: 'yacinejlassia@gmail.com',
  phone: "+216 92531951",
  location: "Cité Khalil, La Marsa, Tunis",
  github_url: "https://github.com/Yassinejlassia",
  linkedin_url: "https://linkedin.com/in/Yassinejlassia",
  about: "Développeur Full-Stack passionné, spécialisé dans la conception d'applications web et de systèmes d'information intelligents. Avec une double casquette Frontend (React, Angular) et Backend (Spring Boot, Django), j'aime concevoir des architectures robustes et résoudre des problèmes complexes pour créer des expériences utilisateur intuitives.",
  photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop"
};

async function seed() {
  console.log("Démarrage de l'insertion du profil...");
  try {
    await setDoc(doc(db, "settings", "profile"), profile);
    console.log(`✅ Profil ajouté avec succès dans Firestore !`);
  } catch (e) {
    console.error(`❌ Erreur :`, e);
  }
  process.exit(0);
}

seed();
