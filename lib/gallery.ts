import { supabase } from './supabase';

export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tech: string[];
}

export const getGalleryProjects = async (): Promise<ProjectItem[]> => {
  const { data, error } = await supabase.from('projects').select('id, title, category, description, image_url, tech');
  if (error) {
    console.error('Error fetching gallery projects:', error);
    return [];
  }
  return (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description,
    image: item.image_url || item.image || '',
    tech: item.tech || []
  }));
};

export const getProjectById = async (id: number): Promise<ProjectItem | null> => {
  const { data, error } = await supabase.from('projects').select('id, title, category, description, image_url, tech').eq('id', id).single();
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  if (!data) return null;
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    description: data.description,
    image: data.image_url || '',
    tech: data.tech || []
  };
};
