import { supabase } from './supabase';

// STORAGE HELPER: Upload image to Supabase Storage
export const uploadImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
  try {
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Return the public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(data.path);

    return urlData?.publicUrl || null;
  } catch (err) {
    console.error('Error in uploadImage:', err);
    return null;
  }
};

// SERVICES
export const addService = async (title: string, description: string, icon?: string) => {
  const { data, error } = await supabase
    .from('services')
    .insert([{ title, description, icon }])
    .select();
  if (error) console.error('Error adding service:', error);
  if (!data || !data[0]) return null;
  const row = data[0] as any;
  return { id: row.id, title: row.title, desc: row.description || '', icon: row.icon || undefined };
};

export const updateService = async (id: number, title: string, description: string, icon?: string) => {
  const { data, error } = await supabase
    .from('services')
    .update({ title, description, icon })
    .eq('id', id)
    .select();
  if (error) console.error('Error updating service:', error);
  if (!data || !data[0]) return null;
  const row = data[0] as any;
  return { id: row.id, title: row.title, desc: row.description || '', icon: row.icon || undefined };
};

export const deleteService = async (id: number) => {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) console.error('Error deleting service:', error);
  return !error;
};

// PROJECTS / GALLERY
export const addProject = async (title: string, category: string, description: string, image_url: string, tech: string[]) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ title, category, description, image_url, tech }])
    .select();
  if (error) console.error('Error adding project:', error);
  if (!data || !data[0]) return null;
  const row = data[0] as any;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    image: row.image_url || row.image || '',
    tech: row.tech || []
  };
};

export const updateProject = async (id: number, title: string, category: string, description: string, image_url: string, tech: string[]) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ title, category, description, image_url, tech })
    .eq('id', id)
    .select();
  if (error) console.error('Error updating project:', error);
  if (!data || !data[0]) return null;
  const row = data[0] as any;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    image: row.image_url || row.image || '',
    tech: row.tech || []
  };
};

export const deleteProject = async (id: number) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) console.error('Error deleting project:', error);
  return !error;
};

// CASE STUDIES
export const addCaseStudy = async (
  title: string,
  description: string,
  category: string,
  content: string,
  cover_image_url: string,
  project_link?: string,
  problem?: string,
  solution?: string,
  tech: string[] = []
) => {
  const { data, error } = await supabase
    .from('case_studies')
    .insert([{ title, description, category, content, cover_image_url, project_link, problem, solution, tech }])
    .select();
  if (error) console.error('Error adding case study:', error);
  if (!data || !data[0]) return null;
  const row = data[0] as any;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    content: row.content,
    coverImage: row.cover_image_url || '',
    projectLink: row.project_link || '',
    problem: row.problem || '',
    solution: row.solution || '',
    tech: row.tech || []
  };
};

export const updateCaseStudy = async (
  id: number,
  title: string,
  description: string,
  category: string,
  content: string,
  cover_image_url: string,
  project_link?: string,
  problem?: string,
  solution?: string,
  tech: string[] = []
) => {
  const { data, error } = await supabase
    .from('case_studies')
    .update({ title, description, category, content, cover_image_url, project_link, problem, solution, tech })
    .eq('id', id)
    .select();
  if (error) console.error('Error updating case study:', error);
  if (!data || !data[0]) return null;
  const row = data[0] as any;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    content: row.content,
    coverImage: row.cover_image_url || '',
    projectLink: row.project_link || '',
    problem: row.problem || '',
    solution: row.solution || '',
    tech: row.tech || []
  };
};

export const deleteCaseStudy = async (id: number) => {
  const { error } = await supabase.from('case_studies').delete().eq('id', id);
  if (error) console.error('Error deleting case study:', error);
  return !error;
};

// TESTIMONIALS
export const addTestimonial = async (quote: string, author: string, company: string, avatar_url?: string) => {
  const payload: any = { quote, author, company };
  if (avatar_url) payload.avatar_url = avatar_url;

  const { data, error } = await supabase
    .from('testimonials')
    .insert([payload])
    .select();
  if (error) console.error('Error adding testimonial:', error);
  if (!data || !data[0]) return null;
  const row = data[0] as any;
  return {
    id: row.id,
    quote: row.quote,
    author: row.author,
    company: row.company,
    avatar: row.avatar_url || ''
  };
};

export const updateTestimonial = async (id: number, quote: string, author: string, company: string, avatar_url?: string) => {
  const payload: any = { quote, author, company };
  if (avatar_url !== undefined) payload.avatar_url = avatar_url;

  const { data, error } = await supabase
    .from('testimonials')
    .update(payload)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating testimonial:', error);
  if (!data || !data[0]) return null;
  const row = data[0] as any;
  return {
    id: row.id,
    quote: row.quote,
    author: row.author,
    company: row.company,
    avatar: row.avatar_url || ''
  };
};

export const deleteTestimonial = async (id: number) => {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) console.error('Error deleting testimonial:', error);
  return !error;
};
