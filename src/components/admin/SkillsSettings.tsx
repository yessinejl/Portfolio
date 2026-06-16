'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { SkillCategory, Skill } from '@/types/skill';

const ICONS = ['Code2', 'Laptop', 'Wrench', 'Lightbulb', 'Server', 'Database'];
const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

export default function SkillsSettings() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const docRef = doc(db, 'settings', 'skills');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCategories(docSnap.data().categories || []);
        }
      } catch (error) {
        console.error('Erreur chargement compétences:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'skills'), { categories });
      alert('Compétences sauvegardées avec succès !');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    setCategories([...categories, { title: 'Nouvelle Catégorie', iconName: 'Code2', skills: [] }]);
  };

  const removeCategory = (index: number) => {
    if(confirm('Supprimer cette catégorie ?')) {
      const newCat = [...categories];
      newCat.splice(index, 1);
      setCategories(newCat);
    }
  };

  const updateCategory = (index: number, field: keyof SkillCategory, value: string) => {
    const newCat = [...categories];
    newCat[index] = { ...newCat[index], [field]: value } as SkillCategory;
    setCategories(newCat);
  };

  const addSkill = (catIndex: number) => {
    const newCat = [...categories];
    newCat[catIndex].skills.push({ name: 'Nouvelle compétence', level: 'Intermédiaire' });
    setCategories(newCat);
  };

  const removeSkill = (catIndex: number, skillIndex: number) => {
    const newCat = [...categories];
    newCat[catIndex].skills.splice(skillIndex, 1);
    setCategories(newCat);
  };

  const updateSkill = (catIndex: number, skillIndex: number, field: keyof Skill, value: string) => {
    const newCat = [...categories];
    newCat[catIndex].skills[skillIndex] = { ...newCat[catIndex].skills[skillIndex], [field]: value };
    setCategories(newCat);
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gérer les Compétences</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((cat, catIndex) => (
          <div key={catIndex} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 flex-grow">
                <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                <input
                  type="text"
                  value={cat.title}
                  onChange={(e) => updateCategory(catIndex, 'title', e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold w-full max-w-xs focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={cat.iconName}
                  onChange={(e) => updateCategory(catIndex, 'iconName', e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <button onClick={() => removeCategory(catIndex)} className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 pl-8">
              {cat.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(catIndex, skillIndex, 'name', e.target.value)}
                    className="flex-grow px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(catIndex, skillIndex, 'level', e.target.value)}
                    className="w-36 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                  </select>
                  <button onClick={() => removeSkill(catIndex, skillIndex)} className="text-slate-400 hover:text-red-500 p-1.5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => addSkill(catIndex)} className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-500 hover:underline font-medium pt-2">
                <Plus className="w-3.5 h-3.5" /> Ajouter une compétence
              </button>
            </div>

          </div>
        ))}

        <button onClick={addCategory} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-semibold flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Ajouter une Catégorie
        </button>
      </div>
    </div>
  );
}
