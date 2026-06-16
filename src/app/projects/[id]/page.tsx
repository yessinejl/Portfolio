'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Project } from '@/types/project';
import { FaGithub } from 'react-icons/fa6';
import { ArrowLeft, Calendar, Tag, Globe, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);

        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Project;
          setupProjectData(data);
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du projet :', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProject();
    }
  }, [id, router]);

  const setupProjectData = (data: Project) => {
    setProject(data);
    const mainImg = data.image_url || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800';
    setActiveImage(mainImg);
    
    // Génération d'une galerie d'images réaliste (vignettes secondaires pour l'effet premium)
    setGallery([
      mainImg,
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800'
    ]);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-900 w-1/3 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-slate-200 dark:bg-slate-900 rounded-2xl w-full" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-20 h-16 bg-slate-200 dark:bg-slate-900 rounded-lg" />
              ))}
            </div>
            <div className="h-6 bg-slate-200 dark:bg-slate-900 w-full rounded" />
            <div className="h-4 bg-slate-200 dark:bg-slate-900 w-5/6 rounded" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-slate-200 dark:bg-slate-900 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Bouton retour */}
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-8 group transition-colors font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Retour aux projets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Colonne Gauche : Galerie d'images et Description */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Galerie d'images interactive */}
          <div className="space-y-4">
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
              <img
                src={activeImage}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            {/* Vignettes */}
            <div className="flex flex-wrap gap-3">
              {gallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    activeImage === imgUrl 
                      ? 'border-blue-600 dark:border-blue-500 scale-102 shadow-sm' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Vignette" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Description détaillée */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {project.title}
            </h1>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-350 leading-relaxed text-base">
              <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                {project.description}
              </p>
              <div className="h-px bg-slate-150 dark:bg-slate-900 my-6" />
              <p>
                {project.content || "Aucun détail supplémentaire n'a été spécifié pour ce projet. Il s'agit d'une démonstration construite avec une architecture propre intégrant les meilleures pratiques du développement web moderne."}
              </p>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Fiche technique et Informations */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-900 pb-3">
              Fiche technique
            </h3>

            {/* Date */}
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-350">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <span className="block font-semibold text-slate-800 dark:text-slate-200">Date de réalisation</span>
                {new Date(project.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                })}
              </div>
            </div>

            {/* Technologies */}
            <div className="flex gap-3 text-sm text-slate-600 dark:text-slate-350">
              <Tag className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <span className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">Technologies</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/30 dark:border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Liens externes */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-900">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow"
                >
                  Visiter le site
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all duration-200"
                >
                  Code source sur GitHub
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
