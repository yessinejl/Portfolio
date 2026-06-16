'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Plus, Trash2, GripVertical, Briefcase, GraduationCap } from 'lucide-react';
import { TimelineItem, TimelineItemType } from '@/types/timeline';

export default function TimelineSettings() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const docRef = doc(db, 'settings', 'timeline');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItems(docSnap.data().items || []);
        }
      } catch (error) {
        console.error('Erreur chargement timeline:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'timeline'), { items });
      alert('Parcours sauvegardé avec succès !');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        type: 'experience',
        title: 'Nouvelle Expérience',
        organization: '',
        period: '',
        description: '',
        technologies: ''
      }
    ]);
  };

  const removeItem = (index: number) => {
    if (confirm('Supprimer cet élément ?')) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: keyof TimelineItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value } as TimelineItem;
    setItems(newItems);
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gérer le Parcours (Timeline)</h2>
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
        {items.map((item, index) => (
          <div key={item.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
            
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                <div className={`p-2 rounded-lg ${item.type === 'experience' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                  {item.type === 'experience' ? <Briefcase className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                </div>
                <select
                  value={item.type}
                  onChange={(e) => updateItem(index, 'type', e.target.value as TimelineItemType)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="experience">Expérience</option>
                  <option value="education">Formation</option>
                </select>
              </div>
              <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">Titre</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Développeur Full-Stack"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">Organisation / École</label>
                <input
                  type="text"
                  value={item.organization}
                  onChange={(e) => updateItem(index, 'organization', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Entreprise XYZ"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">Période</label>
                <input
                  type="text"
                  value={item.period}
                  onChange={(e) => updateItem(index, 'period', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Jan 2023 - Présent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">Technologies (séparées par des virgules)</label>
                <input
                  type="text"
                  value={item.technologies || ''}
                  onChange={(e) => updateItem(index, 'technologies', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: React, Node.js, TypeScript"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-500">Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez vos missions ou votre formation..."
                />
              </div>
            </div>

          </div>
        ))}

        <button onClick={addItem} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer">
          <Plus className="w-5 h-5" />
          Ajouter une étape
        </button>
      </div>
    </div>
  );
}
