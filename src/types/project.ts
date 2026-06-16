export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  tags: string[];
  featured: boolean;
  created_at: string;
}
