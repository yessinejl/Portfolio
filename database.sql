-- =========================================================================
-- SCRIPT D'INITIALISATION DE LA BASE DE DONNÉES PORTFOLIO
-- A exécuter dans l'éditeur SQL (SQL Editor) de votre console Supabase.
-- =========================================================================

-- Nettoyage des anciennes tables si nécessaire
DROP TABLE IF EXISTS public.contacts;
DROP TABLE IF EXISTS public.projects;

-- 1. CREATION DE LA TABLE PROJECTS
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    demo_url TEXT,
    github_url TEXT,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Activation de la sécurité au niveau des lignes (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour projects
-- Politique 1 : Tout le monde (public) peut lire les projets
CREATE POLICY "Allow public read access to projects" 
ON public.projects 
FOR SELECT 
USING (true);

-- Politique 2 : Seuls les utilisateurs authentifiés (admin) peuvent insérer, modifier ou supprimer des projets
CREATE POLICY "Allow full access to authenticated users only" 
ON public.projects 
TO authenticated
USING (true)
WITH CHECK (true);


-- 2. CREATION DE LA TABLE CONTACTS (Messages du formulaire de contact)
CREATE TABLE public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Activation de la sécurité au niveau des lignes (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour contacts
-- Politique 1 : Tout le monde peut envoyer un message (INSERT)
CREATE POLICY "Allow public insertion of contact messages" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

-- Politique 2 : Seuls les utilisateurs authentifiés (admin) peuvent lire ou modifier les messages
CREATE POLICY "Allow select and update to authenticated users only" 
ON public.contacts
TO authenticated
USING (true)
WITH CHECK (true);


-- 3. JEU DE DONNÉES DE DÉMONSTRATION (PROJETS FICTIFS)
INSERT INTO public.projects (title, description, content, image_url, demo_url, github_url, tags, featured)
VALUES 
(
    'E-Commerce Haute Performance', 
    'Une plateforme e-commerce moderne et ultra-rapide développée avec Next.js et Stripe.', 
    'Ce projet est un e-commerce complet avec panier persistant, système de paiement Stripe en mode test, gestion de stock en temps réel et interface d''administration sécurisée.', 
    'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=800', 
    'https://demo-ecommerce.example.com', 
    'https://github.com/votre-username/ecommerce-nextjs', 
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Supabase'],
    true
),
(
    'Application SaaS de Gestion de Tâches', 
    'Un outil de productivité collaboratif avec gestion des rôles et tableaux Kanban interactifs.', 
    'Une application de type Trello avec glisser-déposer (Drag & Drop), gestion d''espaces de travail multiples et authentification via Supabase Auth.', 
    'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?q=80&w=800', 
    'https://saas-taskmanager.example.com', 
    'https://github.com/votre-username/saas-taskmanager', 
    ARRAY['Next.js', 'React', 'Framer Motion', 'Supabase', 'Tailwind CSS'],
    true
),
(
    'Portfolio Personnel Minimaliste', 
    'Ce site web lui-même ! Un condensé de performances et d''animations fluides.', 
    'Conçu pour présenter mes compétences et projets de manière élégante, avec intégration Supabase pour les données dynamiques et le formulaire de contact.', 
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800', 
    'https://mon-portfolio.example.com', 
    'https://github.com/votre-username/portfolio-nextjs', 
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
    false
);


-- 4. CONFIGURATION DU STORAGE POUR LES IMAGES DE PROJETS
-- Permet d'insérer le bucket project-images dans les tables de stockage de Supabase
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Activation de RLS sur les objets de stockage (géré par défaut dans Supabase)
-- Politique 1 : Tout le monde (public) peut lire les images du bucket
CREATE POLICY "Allow public read access to project-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- Politique 2 : Seuls les utilisateurs authentifiés (admin) peuvent gérer les images dans ce bucket
CREATE POLICY "Allow full storage access to authenticated users"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'project-images')
WITH CHECK (bucket_id = 'project-images');
