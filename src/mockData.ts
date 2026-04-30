export interface Project {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  size: 'small' | 'large' | 'tall' | 'wide';
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
}

export const PROJECTS: Project[] = [
  { id: '1', title: 'Urban Escape', category: 'Social Media', videoUrl: '#', thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800', size: 'large' },
  { id: '2', title: 'Mountain Crest', category: 'Real Estate', videoUrl: '#', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800', size: 'wide' },
  { id: '3', title: 'Atlanta Beats', category: 'Brand', videoUrl: '#', thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600', size: 'small' },
  { id: '4', title: 'Corporate Gala', category: 'Events', videoUrl: '#', thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600', size: 'small' },
  { id: '5', title: 'Skyline Loft', category: 'Real Estate', videoUrl: '#', thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', size: 'tall' },
  { id: '6', title: 'Product Launch', category: 'Social Media', videoUrl: '#', thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', size: 'small' },
];

export const POSTS: Post[] = [
  { id: '1', title: 'Maximizing Social Impact', excerpt: 'How to build short-form content that converts.', date: 'April 12, 2026' },
  { id: '2', title: 'The Atlanta Aesthetic', excerpt: 'Exploring the visual language of the south.', date: 'May 04, 2026' },
  { id: '3', title: 'Gear for Solo Shoots', excerpt: 'My go-to setup for mobile productions.', date: 'June 18, 2026' },
];

export const TESTIMONIALS = [
  { id: '1', name: 'Sarah J.', role: 'Marketing Dir', text: 'Maas Media transformed our brand identity with visuals that actually speak to our audience.' },
  { id: '2', name: 'David L.', role: 'Real Estate Agent', text: 'The drone work is unmatched. Every listing gets double the views with Isaac\'s touch.' },
  { id: '3', name: 'Elena R.', role: 'Founder', text: 'Professional, efficient, and incredibly creative. The best in Atlanta.' },
];
