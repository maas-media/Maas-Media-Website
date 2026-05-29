export interface Project {
  id: string;
  title: string;
  categories: string[];
  orientation: 'landscape' | 'vertical';
  vimeoUrl: string;
  thumbnail: string;
  description: string;
  featured: boolean;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  thumbnail: string;
  slug: string;
  featured: boolean;
  youtubeUrl: string;
  content?: string; // Adding content field for detail view
}
