'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useProfile } from '@/context/ProfileContext';
import { Save } from 'lucide-react';
import { ProfileData } from '@/types/profile';

const profileSchema = z.object({
  name: z.string().min(2, 'Le nom est requis.'),
  title: z.string().min(2, 'Le titre est requis.'),
  email: z.string().email('Email invalide.'),
  phone: z.string().min(5, 'Numéro de téléphone invalide.'),
  location: z.string().min(2, 'Localisation requise.'),
  github_url: z.string().url('URL invalide.').or(z.literal('')),
  linkedin_url: z.string().url('URL invalide.').or(z.literal('')),
  about: z.string().optional(),
  photoUrl: z.string().url('URL invalide.').or(z.literal('')).optional(),
  cvUrl: z.string().url('URL invalide.').or(z.literal('')).optional(),
});

export default function ProfileSettings() {
  const { profile, refreshProfile } = useProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      title: profile?.title || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      github_url: profile?.github_url || '',
      linkedin_url: profile?.linkedin_url || '',
      about: profile?.about || '',
      photoUrl: profile?.photoUrl || '',
      cvUrl: profile?.cvUrl || '',
    }
  });

  useEffect(() => {
    if (profile) {
      reset({
        ...profile,
        cvUrl: profile.cvUrl || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileData) => {
    try {
      await setDoc(doc(db, 'settings', 'profile'), data);
      await refreshProfile();
      alert('Profil mis à jour avec succès !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour du profil. Vérifiez vos règles Firebase.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Paramètres du Profil</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nom Complet</label>
            <input
              {...register('name')}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Titre (Ex: Développeur Full-Stack)</label>
            <input
              {...register('title')}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Contact</label>
            <input
              {...register('email')}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Téléphone</label>
            <input
              {...register('phone')}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Localisation</label>
            <input
              {...register('location')}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lien LinkedIn</label>
            <input
              {...register('linkedin_url')}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            {errors.linkedin_url && <p className="text-xs text-red-500">{errors.linkedin_url.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lien GitHub</label>
            <input
              {...register('github_url')}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            {errors.github_url && <p className="text-xs text-red-500">{errors.github_url.message}</p>}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lien Photo de profil (URL)</label>
            <input
              {...register('photoUrl')}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ex: https://media.licdn.com/dms/image/..."
            />
            {errors.photoUrl && <p className="text-xs text-red-500">{errors.photoUrl.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">À Propos</label>
            <textarea
              {...register('about')}
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            {errors.about && <p className="text-xs text-red-500">{errors.about.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Enregistrement...' : 'Sauvegarder les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
