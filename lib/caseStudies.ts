
import { supabase } from './supabase';

export interface CaseStudy {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  content: string; // For rich text content
  tech: string[];
}

export const getCaseStudies = async (): Promise<CaseStudy[]> => {
  const { data, error } = await supabase.from('case_studies').select('id, title, description, category, content, cover_image_url, tech');
  if (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
  // Manually map snake_case to camelCase
  return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      content: item.content,
      coverImage: item.cover_image_url,
      tech: item.tech || []
  }));
};

export const getCaseStudyById = async (id: number): Promise<CaseStudy | null> => {
  const { data, error } = await supabase.from('case_studies').select('id, title, description, category, content, cover_image_url, tech').eq('id', id).single();
  if (error) {
    console.error('Error fetching case study:', error);
    return null;
  }
  if (!data) return null;
  return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      content: data.content,
      coverImage: data.cover_image_url,
      tech: data.tech || []
  };
}
