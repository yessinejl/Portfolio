'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useProfile } from '@/context/ProfileContext';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';

// Définition du schéma de validation Zod
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: z.string().email('Adresse email invalide.'),
  message: z.string().min(10, 'Le message doit faire au moins 10 caractères.'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { profile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await addDoc(collection(db, 'contacts'), {
        name: data.name,
        email: data.email,
        message: data.message,
        read: false,
        created_at: new Date().toISOString()
      });

      setSubmitStatus('success');
      reset();
    } catch (err) {
      console.error('Erreur d\'envoi du message :', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50/50 dark:bg-slate-900/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Me Contacter
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 w-20 bg-blue-600 dark:bg-blue-500 mx-auto mt-4 rounded-full origin-left"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-slate-600 dark:text-slate-400 text-lg"
          >
            Un projet en tête ou simplement envie de discuter ? N'hésitez pas à m'envoyer un message.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Colonne gauche : Infos de contact */}
          <motion.div 
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 75, damping: 15, duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Coordonnées
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-650 dark:text-slate-350">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium">Email</span>
                    <a href={`mailto:${profile?.email || 'yacinejlassia@gmail.com'}`} className="text-sm font-semibold hover:underline">
                      {profile?.email || 'yacinejlassia@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-650 dark:text-slate-350">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium">Téléphone</span>
                    <span className="text-sm font-semibold">{profile?.phone || '+216 92531951'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-650 dark:text-slate-350">
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium">Localisation</span>
                    <span className="text-sm font-semibold">{profile?.location || 'Cité Khalil, La Marsa, Tunis'}</span>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="pt-6 border-t border-slate-150 dark:border-slate-900 space-y-3">
                <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                  Suivez-moi
                </span>
                <div className="flex gap-4">
                  <a
                    href={profile?.github_url || "https://github.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a
                    href={profile?.linkedin_url || "https://linkedin.com/in/Yassinejlassia"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Colonne droite : Formulaire */}
          <motion.div 
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 75, damping: 15, duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form 
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm shadow-sm space-y-5"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Envoyer un message
              </h3>

              {/* Nom */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                  Nom Complet
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                  placeholder="Ex: Jean Dupont"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                  Adresse Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                  placeholder="Ex: jean.dupont@email.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                  Votre Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message')}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.message 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                  placeholder="Expliquez brièvement votre projet ou votre demande..."
                />
                {errors.message && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Alertes de statut de soumission */}
              {submitStatus === 'success' && (
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 text-sm flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold">Message envoyé avec succès !</span>
                    Merci pour votre message. Je vous répondrai dans les plus brefs délais.
                  </div>
                </div>
              )}


              {submitStatus === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold">Erreur lors de l'envoi</span>
                    Une erreur s'est produite lors de l'insertion en base de données. Veuillez réessayer ou utiliser l'adresse e-mail directe.
                  </div>
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white font-medium shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Envoi en cours...</>
                ) : (
                  <>
                    Envoyer le message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
