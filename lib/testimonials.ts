
import { supabase } from './supabase';

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  company: string;
  avatar?: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase.from('testimonials').select('*');
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return (data || []).map((row: any) => ({
    id: row.id,
    quote: row.quote,
    author: row.author,
    company: row.company,
    avatar: row.avatar_url || ''
  })) as Testimonial[];
};
