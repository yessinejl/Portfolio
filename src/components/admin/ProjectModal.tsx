'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { Project } from '@/types/project';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Schéma Zod pour le formulaire projet
const projectFormSchema = z.object({
  title: z.string().min(3, 'Le titre doit faire au moins 3 caractères.'),
  description: z.string().min(5, 'La description doit faire au moins 5 caractères.'),
  content: z.string().optional(),
  image_url: z.string().url('Veuillez entrer une URL valide.').or(z.literal('')),
  demo_url: z.string().url('Veuillez entrer une URL de démo valide.').or(z.literal('')),
  github_url: z.string().url('Veuillez entrer une URL GitHub valide.').or(z.literal('')),
  tagsInput: z.string().min(1, 'Saisissez au moins un tag (séparés par des virgules).'),
  featured: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (data: Omit<Project, 'id' | 'created_at'> & { id?: string }) => Promise<void>;
}

export default function ProjectModal({ isOpen, onClose, project, onSave }: ProjectModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      image_url: '',
      demo_url: '',
      github_url: '',
      tagsInput: '',
      featured: false,
    },
  });

  const imageUrl = watch('image_url');
  const [uploading, setUploading] = React.useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const storageRef = ref(storage, `project-images/${fileName}`);

      const snapshot = await uploadBytes(storageRef, file);
      const publicUrl = await getDownloadURL(snapshot.ref);

      setValue('image_url', publicUrl);
    } catch (err) {
      console.error('Erreur de téléversement :', err);
      alert('Erreur lors du téléversement vers Firebase Storage. Assurez-vous d\'avoir configuré les règles de stockage.');
    } finally {
      setUploading(false);
    }
  };

  // Charger les données en mode "Édition"
  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        content: project.content || '',
        image_url: project.image_url || '',
        demo_url: project.demo_url || '',
        github_url: project.github_url || '',
        tagsInput: project.tags.join(', '),
        featured: project.featured,
      });
    } else {
      reset({
        title: '',
        description: '',
        content: '',
        image_url: '',
        demo_url: '',
        github_url: '',
        tagsInput: '',
        featured: false,
      });
    }
  }, [project, reset, isOpen]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    // Transformer l'input text de tags séparés par des virgules en array de strings propre
    const tags = data.tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    const formattedData = {
      title: data.title,
      description: data.description,
      content: data.content,
      image_url: data.image_url,
      demo_url: data.demo_url,
      github_url: data.github_url,
      tags,
      featured: data.featured,
      ...(project && { id: project.id }),
    };

    await onSave(formattedData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay d'arrière-plan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Corps de la modale */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-2xl z-10 space-y-6"
          >
            {/* Titre & Bouton Fermer */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {project ? 'Modifier le projet' : 'Ajouter un nouveau projet'}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              {/* Titre */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                  Titre du Projet
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Ex: SaaS Kanban Task Manager"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description courte */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                  Description Courte
                </label>
                <input
                  type="text"
                  {...register('description')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Court résumé s'affichant sur la carte d'accueil"
                />
                {errors.description && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Contenu détaillé */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                  Description Détaillée (Corps de la page)
                </label>
                <textarea
                  rows={4}
                  {...register('content')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Expliquez en détail le fonctionnement du projet, les défis relevés..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Image Upload & URL */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                    Image de couverture
                  </label>
                  
                  {/* Aperçu si présente */}
                  {imageUrl && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-900">
                      <img src={imageUrl} alt="Aperçu couverture" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setValue('image_url', '')}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-all text-xs cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}

                  {/* Sélecteur de fichier */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-semibold cursor-pointer transition-colors duration-200">
                      <Upload className="w-4 h-4 text-slate-400" />
                      {uploading ? 'Envoi...' : 'Choisir une image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500">
                      Ou collez un lien ci-dessous
                    </span>
                  </div>

                  {/* Input URL alternatif */}
                  <input
                    type="text"
                    {...register('image_url')}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="https://images.unsplash.com/... (ou base64)"
                  />
                  {errors.image_url && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.image_url.message}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    {...register('tagsInput')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Next.js, Tailwind, Supabase"
                  />
                  {errors.tagsInput && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.tagsInput.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Demo URL */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                    URL de la Démo en ligne
                  </label>
                  <input
                    type="text"
                    {...register('demo_url')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="https://demo.example.com"
                  />
                  {errors.demo_url && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.demo_url.message}
                    </p>
                  )}
                </div>

                {/* GitHub URL */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                    URL du code GitHub
                  </label>
                  <input
                    type="text"
                    {...register('github_url')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="https://github.com/..."
                  />
                  {errors.github_url && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.github_url.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Mettre en valeur (Featured) */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...register('featured')}
                  className="w-4 h-4 rounded text-blue-600 border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 cursor-pointer"
                />
                <label htmlFor="featured" className="text-sm font-semibold text-slate-700 dark:text-slate-350 cursor-pointer">
                  Mettre ce projet en valeur (Featured)
                </label>
              </div>

              {/* Actions de la modale */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-900">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white text-sm font-semibold shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
