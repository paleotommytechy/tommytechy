
import { supabase } from './supabase';

export interface CaseStudy {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  content: string; // For rich text content
  tech: string[];
  projectLink?: string;
  problem?: string;
  solution?: string;
}

export const getCaseStudies = async (): Promise<CaseStudy[]> => {
  const { data, error } = await supabase.from('case_studies').select('*');
  if (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
  // Manually map snake_case to camelCase
  return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category || '',
      content: item.content || '',
      coverImage: item.cover_image_url || '',
      tech: (item.tech && Array.isArray(item.tech)) ? item.tech : [],
      projectLink: item.project_link || '',
      problem: item.problem || '',
      solution: item.solution || ''
  }));
};

export const getCaseStudyById = async (id: number): Promise<CaseStudy | null> => {
  const { data, error } = await supabase.from('case_studies').select('*').eq('id', id).single();
  if (error) {
    console.error('Error fetching case study:', error);
    return null;
  }
  if (!data) return null;
  return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      category: data.category || '',
      content: data.content || '',
      coverImage: data.cover_image_url || '',
      tech: (data.tech && Array.isArray(data.tech)) ? data.tech : [],
      projectLink: data.project_link || '',
      problem: data.problem || '',
      solution: data.solution || ''
  };
}
