'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { Project } from '@/types/project';
import ProjectModal from '@/components/admin/ProjectModal';
import ProfileSettings from '@/components/admin/ProfileSettings';
import SkillsSettings from '@/components/admin/SkillsSettings';
import TimelineSettings from '@/components/admin/TimelineSettings';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check,
  FolderGit2,
  Mail,
  Briefcase,
  Code2,
  LogOut,
  Milestone
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Onglet courant
  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'profile' | 'skills' | 'timeline'>('projects');
  
  // États de données
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  
  // États de modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Vérification de l'authentification au montage
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
      } else {
        try {
          await Promise.all([loadProjectsFromDB(), loadMessagesFromDB()]);
        } catch (err) {
          console.error('Erreur de chargement des données :', err);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Chargement des projets depuis Firebase
  const loadProjectsFromDB = async () => {
    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(projectsQuery);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(data);
    } catch (err) {
      console.error('Erreur chargement projets :', err);
    }
  };

  // Chargement des messages depuis Firebase
  const loadMessagesFromDB = async () => {
    try {
      const messagesQuery = query(
        collection(db, 'contacts'),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(messagesQuery);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactMessage[];
      setMessages(data);
    } catch (err) {
      console.error('Erreur chargement messages :', err);
    }
  };

  // Enregistrer ou modifier un projet (CRUD - Create & Update)
  const handleSaveProject = async (projectData: Omit<Project, 'id' | 'created_at'> & { id?: string }) => {
    try {
      if (projectData.id) {
        const docRef = doc(db, 'projects', projectData.id);
        await updateDoc(docRef, {
          title: projectData.title,
          description: projectData.description,
          content: projectData.content || '',
          image_url: projectData.image_url || '',
          demo_url: projectData.demo_url || '',
          github_url: projectData.github_url || '',
          tags: projectData.tags,
          featured: projectData.featured,
        });
      } else {
        await addDoc(collection(db, 'projects'), {
          title: projectData.title,
          description: projectData.description,
          content: projectData.content || '',
          image_url: projectData.image_url || '',
          demo_url: projectData.demo_url || '',
          github_url: projectData.github_url || '',
          tags: projectData.tags,
          featured: projectData.featured,
          created_at: new Date().toISOString(),
        });
      }
      await loadProjectsFromDB();
    } catch (err) {
      alert('Erreur lors de la sauvegarde du projet.');
      console.error(err);
    }
  };

  // Supprimer un projet (CRUD - Delete)
  const handleDeleteProject = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      await deleteDoc(doc(db, 'projects', id));
      await loadProjectsFromDB();
    } catch (err) {
      alert('Erreur lors de la suppression du projet.');
      console.error(err);
    }
  };

  // Marquer un message comme lu (CRUD contacts)
  const handleToggleMessageRead = async (msgId: string, currentReadStatus: boolean) => {
    try {
      const docRef = doc(db, 'contacts', msgId);
      await updateDoc(docRef, { read: !currentReadStatus });
      await loadMessagesFromDB();
    } catch (err) {
      console.error(err);
    }
  };

  // Supprimer un message
  const handleDeleteMessage = async (msgId: string) => {
    if (!confirm('Supprimer ce message ?')) return;

    try {
      await deleteDoc(doc(db, 'contacts', msgId));
      await loadMessagesFromDB();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Espace Administration
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez vos projets exposés et lisez les demandes de contact.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-sm font-semibold transition-colors duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200/50 dark:border-slate-800/80 mb-8">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'projects'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Projets ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'messages'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          Messages ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Profil & Contact
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'skills'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Compétences
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'timeline'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Milestone className="w-4 h-4" />
          Parcours
        </button>
      </div>

      {/* CONTENU ONGLETS */}
      {activeTab === 'projects' ? (
        // Onglet Projets
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Liste des projets</h2>
            <button
              onClick={() => {
                setSelectedProject(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nouveau projet
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40">
              <FolderGit2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Aucun projet configuré.</p>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setIsModalOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-500 text-sm font-semibold hover:underline"
              >
                Créer un premier projet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm shadow-sm flex gap-4 items-start hover:border-slate-300 dark:hover:border-slate-750 transition-all duration-205"
                >
                  {/* Miniature Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                    {project.image_url ? (
                      <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-350 dark:text-slate-600">
                        <FolderGit2 className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  
                  {/* Infos & Actions */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mt-1 mb-3">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-650 dark:text-slate-350 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-500" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-100 dark:hover:border-red-900/40 text-slate-650 dark:text-slate-350 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'messages' ? (
        // Onglet Messages
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages du formulaire de contact</h2>

          {messages.length === 0 ? (
            <div className="text-center p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40">
              <Mail className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Aucun message reçu pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-6 rounded-2xl border transition-all duration-205 space-y-4 ${
                    msg.read 
                      ? 'border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 opacity-80' 
                      : 'border-blue-100 dark:border-blue-900/30 bg-blue-50/10 dark:bg-blue-900/5 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-base">
                        {msg.name}
                      </span>
                      <a href={`mailto:${msg.email}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline block sm:inline sm:ml-2">
                        {msg.email}
                      </a>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {new Date(msg.created_at).toLocaleString('fr-FR', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-350 text-sm whitespace-pre-line leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-900">
                    <button
                      onClick={() => handleToggleMessageRead(msg.id, msg.read)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                        msg.read
                          ? 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                          : 'border-blue-200 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {msg.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-100 dark:hover:border-red-900/40 text-slate-500 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'profile' ? (
        // Onglet Profil
        <div className="space-y-6">
          <ProfileSettings />
        </div>
      ) : activeTab === 'skills' ? (
        // Onglet Compétences
        <div className="space-y-6">
          <SkillsSettings />
        </div>
      ) : (
        // Onglet Parcours
        <div className="space-y-6">
          <TimelineSettings />
        </div>
      )}

      {/* MODALE CRUD PROJET */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onSave={handleSaveProject}
      />

    </div>
  );
}
