import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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

const projects = [
  {
    title: "Plateforme Hybride de Location d'Équipements",
    description: "Plateforme full-stack intégrant deux logiques métiers de location interne et externe avec scoring et IA.",
    content: "Conception et développement d'une plateforme full-stack intégrant deux logiques métiers : location interne gratuite pour employés et location externe payante pour clients.\n\nImplémentation d'un système de scoring utilisateur intelligent, d'un moteur de règles métiers et d'une IA de recommandation d'équipements.\n\nDéveloppement de la génération automatique de contrats PDF, signature électronique, gestion financière (Stripe), tableau de bord BI et gestion du cycle de vie des équipements.",
    image_url: "",
    demo_url: "",
    github_url: "",
    tags: ["React.js", "Python", "Django", "Fast API", "PostgreSQL", "Stripe API"],
    featured: true,
  },
  {
    title: "SmartAdvisor – Système de recommandation IA",
    description: "Application mobile IA aidant les étudiants à choisir leurs parcours et stages par filtrage collaboratif.",
    content: "Conception et développement d'une application mobile aidant les étudiants à choisir des cours, spécialités et stages selon leurs résultats académiques et préférences.\n\nImplémentation d'un système de recommandation IA basé sur le filtrage collaboratif (KNNBasic).\n\nDéveloppement du backend en Flask, avec modèle ML sauvegardé via joblib et exposé sous forme d'API REST. Création du frontend mobile en React Native (profil étudiant, dashboard de recommandations, historique).",
    image_url: "",
    demo_url: "",
    github_url: "",
    tags: ["React Native", "Python", "Flask", "Scikit-learn", "API REST"],
    featured: true,
  },
  {
    title: "Application de gestion des absences",
    description: "Application web et mobile avec Flutter et Django pour le suivi et la gestion des absences étudiantes.",
    content: "Conception et développement d'une application web et mobile pour la gestion des absences des étudiants.\n\nInterface web développée avec Django et intégration d'une API REST pour la communication avec l'application mobile développée en Flutter.",
    image_url: "",
    demo_url: "",
    github_url: "",
    tags: ["Django 5", "Python", "Flutter", "MySQL", "API REST"],
    featured: false,
  },
  {
    title: "Application Web de Scraping",
    description: "Site web permettant de collecter, filtrer et rechercher des données dynamiques extraites en ligne.",
    content: "Conception et développement d'un site web permettant de collecter des données depuis différentes sources en ligne.\n\nAffichage dynamique des données extraites avec des fonctionnalités avancées de filtres et de recherche.",
    image_url: "",
    demo_url: "",
    github_url: "",
    tags: ["Angular 16", "SpringBoot", "MySQL", "Git"],
    featured: false,
  },
  {
    title: "Site Portfolio (Symfony)",
    description: "Développement d'un site web personnel avec panneau d'administration sur mesure.",
    content: "Développement d'un site web personnel pour présenter les projets, compétences et expériences.\n\nIntégration d'un panneau d'administration sécurisé permettant d'ajouter, modifier et supprimer facilement des projets du portfolio.",
    image_url: "",
    demo_url: "",
    github_url: "",
    tags: ["Symfony 6", "PHP 8", "Twig", "MySQL", "Bootstrap"],
    featured: false,
  }
];

async function seed() {
  console.log("Démarrage de l'insertion des projets...");
  for (const project of projects) {
    try {
      project.created_at = serverTimestamp();
      const docRef = await addDoc(collection(db, "projects"), project);
      console.log(`✅ Ajouté : ${project.title} (${docRef.id})`);
    } catch (e) {
      console.error(`❌ Erreur sur ${project.title} :`, e);
    }
  }
  console.log("Terminé !");
  process.exit(0);
}

seed();
