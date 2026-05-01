export interface Project {
  id: string;
  title: string;
  category: string;
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

/**
 * TO ADD A NEW PROJECT:
 * 1. Add a new object to this array following the structure below
 * 2. Set orientation to "landscape" or "vertical"
 * 3. Set category to one of: "Brand & Commercial", "Real Estate", "Events", "Social Content"
 * 4. Set vimeoUrl to the Vimeo player embed URL for the video
 * 5. Set thumbnail to the relative path of the thumbnail image in /assets/images/
 * 6. Set featured to true if this project should be prioritized for a cinematic full-width slot
 * 7. Save the file — the grid will update automatically
 */
export const portfolioProjects: Project[] = [
  { 
    id: '1', 
    title: 'Featured Experience', 
    category: 'Brand & Commercial', 
    orientation: 'landscape',
    vimeoUrl: 'https://player.vimeo.com/video/1188089564', 
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1200',
    description: 'An immersive brand journey showcasing cinematic aesthetics and modern storytelling techniques.',
    featured: true
  },
  { 
    id: '2', 
    title: 'Urban Portrait', 
    category: 'Social Content', 
    orientation: 'vertical',
    vimeoUrl: 'https://player.vimeo.com/video/1188089564', 
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    description: 'A striking vertical exploration of city textures and human connection in the digital age.',
    featured: false
  },
  { 
    id: '3', 
    title: 'Estate Showcase', 
    category: 'Real Estate', 
    orientation: 'landscape',
    vimeoUrl: 'https://player.vimeo.com/video/1188089564', 
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    description: 'Capturing the flow and light of architectural masterpieces with high-end production value.',
    featured: false
  },
  { 
    id: '4', 
    title: 'Event Highlights', 
    category: 'Events', 
    orientation: 'landscape',
    vimeoUrl: 'https://player.vimeo.com/video/1188089564', 
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200',
    description: 'Preserving the energy and atmosphere of world-class events through dynamic visuals.',
    featured: false
  },
  { 
    id: '5', 
    title: 'Model Study', 
    category: 'Social Content', 
    orientation: 'vertical',
    vimeoUrl: 'https://player.vimeo.com/video/1188089564', 
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    description: 'Character-driven portrait series designed for high-impact social media engagement.',
    featured: false
  },
  { 
    id: '6', 
    title: 'Vertical Brand Story', 
    category: 'Brand & Commercial', 
    orientation: 'vertical',
    vimeoUrl: 'https://player.vimeo.com/video/1188089564', 
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    description: 'Reimagining commercial content for vertical-first viewing experiences.',
    featured: false
  }
];

export const PROJECTS: Project[] = portfolioProjects;

/**
 * TO ADD A NEW BLOG POST:
 * 1. Add a new object to this array following the structure below
 * 2. Set featured: true on only one post at a time — the most recent or most important
 * 3. Set youtubeUrl to the full YouTube embed URL if a corresponding video exists, otherwise leave as ""
 * 4. Save the file — the blog grid will update automatically
 */
export const BLOG_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Art of the Drone: Capturing Cinematic Vistas',
    category: 'Tips',
    date: 'January 15, 2025',
    excerpt: 'Mastering drone cinematography requires more than just flying; it is about understanding light, movement, and the geometry of the landscape.',
    thumbnail: 'https://images.unsplash.com/photo-1473963456455-ac89710cc879?auto=format&fit=crop&q=80&w=1200',
    slug: 'art-of-the-drone',
    featured: true,
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
  {
    id: '2',
    title: 'Atlanta Neighborhoods: A Visual Guide for Real Estate',
    category: 'Atlanta',
    date: 'February 02, 2025',
    excerpt: 'Exploring the unique visual character of Buckhead, Midtown, and Old Fourth Ward to help agents tell a better story.',
    thumbnail: 'https://images.unsplash.com/photo-1575917649705-5b59aec1ad6a?auto=format&fit=crop&q=80&w=800',
    slug: 'atlanta-visual-guide',
    featured: false,
    youtubeUrl: '',
  },
  {
    id: '3',
    title: '5 Tips for Better Social Media Content',
    category: 'Tips',
    date: 'February 10, 2025',
    excerpt: 'Short-form video is king. Here is how to make every second count without sacrificing your brand aesthetic.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    slug: 'social-media-tips',
    featured: false,
    youtubeUrl: '',
  },
  {
    id: '4',
    title: 'Why Interior Lighting is the Most Important Factor',
    category: 'Industry',
    date: 'February 18, 2025',
    excerpt: 'Lighting sets the tone. We dive deep into why high-end interior lighting transforms a standard house tour into a luxury experience.',
    thumbnail: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
    slug: 'interior-lighting-importance',
    featured: false,
    youtubeUrl: '',
  },
  {
    id: '5',
    title: 'My Favorite Gear for 2025 Mobile Projects',
    category: 'Behind the Lens',
    date: 'March 01, 2025',
    excerpt: 'A look inside my bag for this year\'s most demanding projects. From gimbals to filters, here is what is making the cut.',
    thumbnail: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&q=80&w=800',
    slug: 'gear-for-2025',
    featured: false,
    youtubeUrl: '',
  }
];

export const POSTS: Post[] = BLOG_POSTS;

export const TESTIMONIALS = [
  { id: '1', name: 'Sarah J.', role: 'Marketing Dir', text: 'Maas Media transformed our brand identity with visuals that actually speak to our audience.' },
  { id: '2', name: 'David L.', role: 'Real Estate Agent', text: 'The drone work is unmatched. Every listing gets double the views with Isaac\'s touch.' },
  { id: '3', name: 'Elena R.', role: 'Founder', text: 'Professional, efficient, and incredibly creative. The best in Atlanta.' },
];
