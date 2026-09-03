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
        { name: "Python (Django / FastAPI / Flask)", level: "Avancé" },
        { name: "PHP / Symfony 6", level: "Avancé" }
      ]
    },
    {
      title: "Frontend & Mobile",
      iconName: "Laptop",
      skills: [
        { name: "React.js / React Native", level: "Expert" },
        { name: "Angular 16", level: "Avancé" },
        { name: "Flutter", level: "Avancé" },
        { name: "HTML5 / CSS3 / JavaScript / TypeScript", level: "Expert" }
      ]
    },
    {
      title: "Bases de Données & IA",
      iconName: "Database",
      skills: [
        { name: "MySQL / PostgreSQL", level: "Expert" },
        { name: "SQL Server", level: "Avancé" },
        { name: "Scikit-learn / Machine Learning", level: "Intermédiaire" }
      ]
    },
    {
      title: "Outils & Méthodologies",
      iconName: "Wrench",
      skills: [
        { name: "Git / GitHub", level: "Expert" },
        { name: "API REST / JWT + OAuth2", level: "Expert" },
        { name: "Postman / Stripe API", level: "Avancé" },
        { name: "Agilité / Résolution de problèmes", level: "Expert" }
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
