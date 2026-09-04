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
  about: "Étudiant en Licence Développement des Systèmes d'Information à l'ISET Médenine et Développeur Full-Stack passionné. Fort d'expériences concrètes avec Java/Spring Boot, Angular, React/React Native, Python (Django/Flask), Flutter et Symfony, je suis spécialisé dans la conception d'applications web et mobiles modernes, intelligentes et robustes.",
  photoUrl: "/photoYassine.png"
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
