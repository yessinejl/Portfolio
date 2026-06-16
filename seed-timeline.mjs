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

const timelineData = {
  items: [
    {
      id: "exp-1",
      type: "experience",
      title: "Projet de fin d'étude – Plateforme Hybride Intelligente de Location d'Équipements",
      organization: "Projet Académique",
      period: "02/2026 – Présent",
      description: "✓ Conception et développement d'une plateforme full-stack intégrant deux logiques métiers : location interne gratuite pour employés et location externe payante pour clients.\n✓ Implémentation d'un système de scoring utilisateur intelligent, d'un moteur de règles métiers et d'une IA de recommandation d'équipements.\n✓ Développement de la génération automatique de contrats PDF, signature électronique, gestion financière (Stripe), tableau de bord BI et gestion du cycle de vie des équipements.",
      technologies: "React.js, Python, Django/Fast API, PostgreSQL, JWT + OAuth2, Stripe API, Git."
    },
    {
      id: "exp-2",
      type: "experience",
      title: "Stage technicien – Développement d'un site web de scraping",
      organization: "Entreprise",
      period: "01/2025 – 02/2025",
      description: "✓ Conception et développement d'un site web permettant de collecter des données depuis différentes sources en ligne.\n✓ Affichage dynamique des données extraites avec filtres et recherche.",
      technologies: "Angular 16 (Front-end), SpringBoot (Back-end), MySQL, Git."
    },
    {
      id: "exp-3",
      type: "experience",
      title: "Stage d'initiation",
      organization: "SONEDE La Marsa",
      period: "01/2024 – 02/2024",
      description: "✓ Découverte du fonctionnement du service informatique et du réseau interne.\n✓ Observation de la maintenance des postes et du câblage réseau.",
      technologies: ""
    },
    {
      id: "edu-1",
      type: "education",
      title: "Licence en Développement des systèmes d'information",
      organization: "ISET Médenine",
      period: "2023 – Présent",
      description: "",
      technologies: ""
    }
  ]
};

async function seed() {
  console.log("Démarrage de l'insertion de la timeline...");
  try {
    await setDoc(doc(db, "settings", "timeline"), timelineData);
    console.log(`✅ Timeline ajoutée avec succès dans Firestore !`);
  } catch (e) {
    console.error(`❌ Erreur :`, e);
  }
  process.exit(0);
}

seed();
