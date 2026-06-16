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

const skillsData = {
  categories: [
    {
      title: "Backend",
      iconName: "Server",
      skills: [
        { name: "Java / Spring Boot", level: "Expert" },
        { name: "Node.js / NestJS", level: "Avancé" },
        { name: "PHP / Symfony", level: "Avancé" }
      ]
    },
    {
      title: "Frontend",
      iconName: "Laptop",
      skills: [
        { name: "React / Next.js", level: "Expert" },
        { name: "Angular", level: "Avancé" },
        { name: "HTML / CSS / Tailwind", level: "Expert" }
      ]
    },
    {
      title: "Bases de données",
      iconName: "Database",
      skills: [
        { name: "MySQL / SQL Server", level: "Expert" },
        { name: "Oracle", level: "Avancé" },
        { name: "MongoDB", level: "Intermédiaire" }
      ]
    },
    {
      title: "Outils & Architecture",
      iconName: "Wrench",
      skills: [
        { name: "Git / GitHub", level: "Expert" },
        { name: "API REST / GraphQL", level: "Expert" },
        { name: "Microservices", level: "Avancé" },
        { name: "Méthode Scrum Agile", level: "Expert" }
      ]
    }
  ]
};

async function seed() {
  console.log("Démarrage de l'insertion des compétences...");
  try {
    await setDoc(doc(db, "settings", "skills"), skillsData);
    console.log(`✅ Compétences ajoutées avec succès dans Firestore !`);
  } catch (e) {
    console.error(`❌ Erreur :`, e);
  }
  process.exit(0);
}

seed();
