import { supabase } from './supabase';

export interface Service {
  id: number;
  title: string;
  desc: string;
  icon?: string;
}

export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase.from('services').select('id, title, description, icon');
  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  return (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    desc: item.description || '',
    icon: item.icon || undefined,
  }));
};

export const getServiceById = async (id: number): Promise<Service | null> => {
  const { data, error } = await supabase.from('services').select('id, title, description, icon').eq('id', id).single();
  if (error) {
    console.error('Error fetching service:', error);
    return null;
  }
  if (!data) return null;
  return { id: data.id, title: data.title, desc: data.description || '', icon: data.icon || undefined };
};
