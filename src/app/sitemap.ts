import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://votre-portfolio.com';

  // Pages statiques principales
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
  ];

  try {
    // Récupérer les projets de la base de données
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      created_at: doc.data().created_at,
    }));

    const dynamicUrls = projects.map((project) => {
      let date = new Date();
      if (project.created_at) {
        if (typeof project.created_at === 'object' && 'seconds' in (project.created_at as any)) {
          date = new Date((project.created_at as any).seconds * 1000);
        } else {
          const parsed = new Date(project.created_at);
          if (!isNaN(parsed.getTime())) {
            date = parsed;
          }
        }
      }
      return {
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: date,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });

    return [...staticUrls, ...dynamicUrls];
  } catch (err) {
    console.error('Erreur lors de la génération du sitemap :', err);
    return staticUrls;
  }
}
