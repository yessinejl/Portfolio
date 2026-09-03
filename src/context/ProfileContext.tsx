'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ProfileData } from '@/types/profile';

interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const defaultProfile: ProfileData = {
  name: 'Yassine Jlassia',
  title: 'Développeur Full-Stack',
  email: 'yacinejlassia@gmail.com',
  phone: '+216 92531951',
  location: 'Cité Khalil, La Marsa, Tunis',
  github_url: 'https://github.com/Yassinejlassia',
  linkedin_url: 'https://linkedin.com/in/Yassinejlassia',
  about: "Étudiant en Licence Développement des Systèmes d'Information à l'ISET Médenine et Développeur Full-Stack passionné. Fort d'expériences concrètes avec Java/Spring Boot, Angular, React/React Native, Python (Django/Flask), Flutter et Symfony, je suis spécialisé dans la conception d'applications web et mobiles modernes, intelligentes et robustes.",
  photoUrl: '/profile.webp',
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  loading: true,
  refreshProfile: async () => {},
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData | null>(defaultProfile);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'settings', 'profile');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as ProfileData;
        const photoUrl = (!data.photoUrl || data.photoUrl.includes('unsplash.com')) ? '/profile.webp' : data.photoUrl;
        setProfile({ id: docSnap.id, ...data, photoUrl });
      } else {
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
