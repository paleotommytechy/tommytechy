
import { supabase } from './supabase';

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  company: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase.from('testimonials').select('*');
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data as Testimonial[];
};
