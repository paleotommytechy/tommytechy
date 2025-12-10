import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Settings, X, Upload } from 'lucide-react';
import { 
  addService, updateService, deleteService,
  addProject, updateProject, deleteProject,
  addCaseStudy, updateCaseStudy, deleteCaseStudy,
  addTestimonial, updateTestimonial, deleteTestimonial,
  uploadImage
} from '../lib/admin';
import { getServices } from '../lib/services';
import { getGalleryProjects } from '../lib/gallery';
import { getCaseStudies } from '../lib/caseStudies';
import { getTestimonials } from '../lib/testimonials';

type AdminTab = 'testimonials' | 'services' | 'gallery' | 'casestudies';

interface Service { id: number; title: string; desc: string; icon?: string; }
interface Project { id: number; title: string; category: string; description: string; image: string; tech: string[]; }
interface CaseStudy { id: number; title: string; description: string; category: string; content: string; coverImage: string; tech: string[]; }
interface Testimonial { id: number; quote: string; author: string; company: string; avatar?: string }

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('testimonials');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<Project[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [tdata, sdata, gdata, cdata] = await Promise.all([
          getTestimonials(),
          getServices(),
          getGalleryProjects(),
          getCaseStudies()
        ]);
        setTestimonials(tdata as any);
        setServices(sdata as any);
        setGallery(gdata as any);
        setCaseStudies(cdata as any);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#0f1012]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-12">Manage your content: testimonials, services, gallery, and case studies.</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {(['testimonials', 'services', 'gallery', 'casestudies'] as AdminTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#00ffff] text-[#1a1b1e]'
                  : 'clay-btn text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading content...</div>
        ) : (
          <>
            {activeTab === 'testimonials' && <TestimonialsManager data={testimonials} setData={setTestimonials} />}
            {activeTab === 'services' && <ServicesManager data={services} setData={setServices} />}
            {activeTab === 'gallery' && <GalleryManager data={gallery} setData={setGallery} />}
            {activeTab === 'casestudies' && <CaseStudiesManager data={caseStudies} setData={setCaseStudies} />}
          </>
        )}
      </div>
    </div>
  );
};

// TESTIMONIALS MANAGER
const TestimonialsManager: React.FC<{ data: Testimonial[]; setData: (d: Testimonial[]) => void }> = ({ data, setData }) => {
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [company, setCompany] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAdd = async () => {
    if (quote.trim() && author.trim() && company.trim()) {
      setUploadingAvatar(true);
      let avatarUrl = '';
      if (avatarFile) {
        const uploaded = await uploadImage(avatarFile, 'testimonials');
        if (!uploaded) {
          alert('Failed to upload avatar');
          setUploadingAvatar(false);
          return;
        }
        avatarUrl = uploaded;
      }
      const result = await addTestimonial(quote, author, company, avatarUrl || undefined);
      if (result) {
        setData([...data, result as any]);
        setQuote('');
        setAuthor('');
        setCompany('');
        setAvatarFile(null);
        setAvatarPreview('');
      }
      setUploadingAvatar(false);
    }
  };

  const handleUpdate = async () => {
    if (editing && quote.trim() && author.trim() && company.trim()) {
      setUploadingAvatar(true);
      let avatarUrl: string | undefined = undefined;
      if (avatarFile) {
        const uploaded = await uploadImage(avatarFile, 'testimonials');
        if (!uploaded) {
          alert('Failed to upload avatar');
          setUploadingAvatar(false);
          return;
        }
        avatarUrl = uploaded;
      }
      const result = await updateTestimonial(editing.id, quote, author, company, avatarUrl);
      if (result) {
        setData(data.map(t => t.id === editing.id ? (result as any) : t));
        setEditing(null);
        setQuote('');
        setAuthor('');
        setCompany('');
        setAvatarFile(null);
        setAvatarPreview('');
      }
      setUploadingAvatar(false);
    }
  };

  const handleDelete = async (id: number) => {
    const success = await deleteTestimonial(id);
    if (success) setData(data.filter(t => t.id !== id));
  };

  const startEdit = (t: Testimonial) => {
    setEditing(t);
    setQuote(t.quote);
    setAuthor(t.author);
    setCompany(t.company);
    setAvatarPreview((t as any).avatar || '');
    setAvatarFile(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setQuote('');
    setAuthor('');
    setCompany('');
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="clay-card p-6">
        <h3 className="text-2xl font-bold text-white mb-4">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
        <div className="space-y-4">
          <textarea
            placeholder="Quote"
            className="clay-input w-full p-3 h-24"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Author Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleAvatarSelect} className="clay-input w-full p-3 text-gray-400" />
            {avatarPreview && (
              <div className="w-20 h-20 rounded-full overflow-hidden mt-2">
                <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Author Name"
            className="clay-input w-full p-3"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Company"
            className="clay-input w-full p-3"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              onClick={editing ? handleUpdate : handleAdd}
              className="clay-btn-accent flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <PlusCircle size={18} /> {editing ? 'Update' : 'Add'}
            </button>
            {editing && (
              <button
                onClick={cancelEdit}
                className="clay-btn flex-1 py-3 rounded-lg font-bold text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map(t => (
          <div key={t.id} className="clay-card p-4 flex justify-between items-start gap-4">
            <div className="flex-1 flex items-start gap-4">
              {((t as any).avatar) && (
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <img src={(t as any).avatar} alt={`${t.author} avatar`} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="text-gray-300 italic mb-2">"{t.quote}"</p>
                <p className="text-white font-bold">{t.author}</p>
                <p className="text-gray-500 text-sm">{t.company}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(t)}
                className="text-[#00ffff] p-2 hover:bg-[#00ffff]/10 rounded-lg transition"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// SERVICES MANAGER
const ServicesManager: React.FC<{ data: Service[]; setData: (d: Service[]) => void }> = ({ data, setData }) => {
  const [editing, setEditing] = useState<Service | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('');

  const handleAdd = async () => {
    if (title.trim() && desc.trim()) {
      const result = await addService(title, desc, icon || undefined);
      if (result) {
        setData([...data, result as any]);
        setTitle('');
        setDesc('');
        setIcon('');
      }
    }
  };

  const handleUpdate = async () => {
    if (editing && title.trim() && desc.trim()) {
      const result = await updateService(editing.id, title, desc, icon || undefined);
      if (result) {
        setData(data.map(s => s.id === editing.id ? (result as any) : s));
        setEditing(null);
        setTitle('');
        setDesc('');
        setIcon('');
      }
    }
  };

  const handleDelete = async (id: number) => {
    const success = await deleteService(id);
    if (success) setData(data.filter(s => s.id !== id));
  };

  const startEdit = (s: Service) => {
    setEditing(s);
    setTitle(s.title);
    setDesc(s.desc);
    setIcon(s.icon || '');
  };

  const cancelEdit = () => {
    setEditing(null);
    setTitle('');
    setDesc('');
    setIcon('');
  };

  return (
    <div className="space-y-6">
      <div className="clay-card p-6">
        <h3 className="text-2xl font-bold text-white mb-4">{editing ? 'Edit Service' : 'Add Service'}</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Service Title"
            className="clay-input w-full p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="clay-input w-full p-3 h-24"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            type="text"
            placeholder="Icon (optional)"
            className="clay-input w-full p-3"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              onClick={editing ? handleUpdate : handleAdd}
              className="clay-btn-accent flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <PlusCircle size={18} /> {editing ? 'Update' : 'Add'}
            </button>
            {editing && (
              <button
                onClick={cancelEdit}
                className="clay-btn flex-1 py-3 rounded-lg font-bold text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map(s => (
          <div key={s.id} className="clay-card p-4 flex justify-between items-center gap-4">
            <div>
              <p className="text-white font-bold">{s.title}</p>
              <p className="text-gray-400 text-sm">{s.desc}</p>
              {s.icon && <p className="text-gray-500 text-xs mt-1">Icon: {s.icon}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(s)}
                className="text-[#00ffff] p-2 hover:bg-[#00ffff]/10 rounded-lg transition"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// GALLERY MANAGER
const GalleryManager: React.FC<{ data: Project[]; setData: (d: Project[]) => void }> = ({ data, setData }) => {
  const [editing, setEditing] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tech, setTech] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    if (title.trim() && category.trim()) {
      setUploading(true);
      let finalImage = image;
      
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile, 'gallery');
        if (!uploadedUrl) {
          alert('Failed to upload image');
          setUploading(false);
          return;
        }
        finalImage = uploadedUrl;
      }

      const result = await addProject(title, category, description, finalImage, tech.split(',').map(t => t.trim()).filter(t => t));
      if (result) {
        setData([...data, result as any]);
        resetForm();
      }
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (editing && title.trim() && category.trim()) {
      setUploading(true);
      let finalImage = image;
      
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile, 'gallery');
        if (!uploadedUrl) {
          alert('Failed to upload image');
          setUploading(false);
          return;
        }
        finalImage = uploadedUrl;
      }

      const result = await updateProject(editing.id, title, category, description, finalImage, tech.split(',').map(t => t.trim()).filter(t => t));
      if (result) {
        setData(data.map(p => p.id === editing.id ? (result as any) : p));
        resetForm();
        setEditing(null);
      }
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const success = await deleteProject(id);
    if (success) setData(data.filter(p => p.id !== id));
  };

  const startEdit = (p: Project) => {
    setEditing(p);
    setTitle(p.title);
    setCategory(p.category);
    setDescription(p.description);
    setImage(p.image);
    setImagePreview(p.image);
    setImageFile(null);
    setTech(p.tech.join(', '));
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setImage('');
    setImageFile(null);
    setImagePreview('');
    setTech('');
  };

  const cancelEdit = () => {
    setEditing(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="clay-card p-6">
        <h3 className="text-2xl font-bold text-white mb-4">{editing ? 'Edit Project' : 'Add Project'}</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Title" className="clay-input w-full p-3" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" placeholder="Category" className="clay-input w-full p-3" value={category} onChange={(e) => setCategory(e.target.value)} />
          <textarea placeholder="Description" className="clay-input w-full p-3 h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
          
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Project Image</label>
            <div className="flex gap-3">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageSelect}
                className="flex-1 clay-input p-3 text-gray-400"
              />
            </div>
            {imagePreview && (
              <div className="relative w-40 h-40 rounded overflow-hidden bg-gray-800">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <input type="text" placeholder="Tech (comma-separated)" className="clay-input w-full p-3" value={tech} onChange={(e) => setTech(e.target.value)} />
          <div className="flex gap-3">
            <button 
              onClick={editing ? handleUpdate : handleAdd} 
              disabled={uploading}
              className="clay-btn-accent flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <PlusCircle size={18} /> {uploading ? 'Uploading...' : (editing ? 'Update' : 'Add')}
            </button>
            {editing && (
              <button onClick={cancelEdit} className="clay-btn flex-1 py-3 rounded-lg font-bold text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map(p => (
          <div key={p.id} className="clay-card p-4 flex flex-col">
            {p.image && <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded mb-3" />}
            <h4 className="text-white font-bold mb-1">{p.title}</h4>
            <p className="text-gray-500 text-sm mb-2">{p.category}</p>
            <p className="text-gray-300 text-sm flex-1">{p.description}</p>
            {p.tech.length > 0 && <div className="flex flex-wrap gap-1 mt-3"><span className="text-xs text-gray-500">{p.tech.join(', ')}</span></div>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => startEdit(p)} className="text-[#00ffff] p-2 hover:bg-[#00ffff]/10 rounded-lg transition"><Settings size={16} /></button>
              <button onClick={() => handleDelete(p.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// CASE STUDIES MANAGER
const CaseStudiesManager: React.FC<{ data: CaseStudy[]; setData: (d: CaseStudy[]) => void }> = ({ data, setData }) => {
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [tech, setTech] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setCoverImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    if (title.trim() && category.trim()) {
      setUploading(true);
      let finalCoverImage = coverImage;

      if (coverImageFile) {
        const uploadedUrl = await uploadImage(coverImageFile, 'case-studies');
        if (!uploadedUrl) {
          alert('Failed to upload cover image');
          setUploading(false);
          return;
        }
        finalCoverImage = uploadedUrl;
      }

      const result = await addCaseStudy(
        title,
        description,
        category,
        content,
        finalCoverImage,
        projectLink,
        problem,
        solution,
        tech.split(',').map(t => t.trim()).filter(t => t)
      );
      if (result) {
        setData([...data, result as any]);
        resetForm();
      }
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (editing && title.trim() && category.trim()) {
      setUploading(true);
      let finalCoverImage = coverImage;

      if (coverImageFile) {
        const uploadedUrl = await uploadImage(coverImageFile, 'case-studies');
        if (!uploadedUrl) {
          alert('Failed to upload cover image');
          setUploading(false);
          return;
        }
        finalCoverImage = uploadedUrl;
      }

      const result = await updateCaseStudy(
        editing.id,
        title,
        description,
        category,
        content,
        finalCoverImage,
        projectLink,
        problem,
        solution,
        tech.split(',').map(t => t.trim()).filter(t => t)
      );
      if (result) {
        setData(data.map(cs => cs.id === editing.id ? (result as any) : cs));
        resetForm();
        setEditing(null);
      }
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const success = await deleteCaseStudy(id);
    if (success) setData(data.filter(cs => cs.id !== id));
  };

  const startEdit = (cs: CaseStudy) => {
    setEditing(cs);
    setTitle(cs.title);
    setCategory(cs.category);
    setDescription(cs.description);
    setContent(cs.content);
    setCoverImage(cs.coverImage);
    setCoverImagePreview(cs.coverImage);
    setCoverImageFile(null);
    setTech(cs.tech.join(', '));
    setProjectLink((cs as any).projectLink || '');
    setProblem((cs as any).problem || '');
    setSolution((cs as any).solution || '');
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setContent('');
    setCoverImage('');
    setCoverImageFile(null);
    setCoverImagePreview('');
    setTech('');
    setProjectLink('');
    setProblem('');
    setSolution('');
  };

  const cancelEdit = () => {
    setEditing(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="clay-card p-6">
        <h3 className="text-2xl font-bold text-white mb-4">{editing ? 'Edit Case Study' : 'Add Case Study'}</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Title" className="clay-input w-full p-3" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" placeholder="Category" className="clay-input w-full p-3" value={category} onChange={(e) => setCategory(e.target.value)} />
          <textarea placeholder="Description (short)" className="clay-input w-full p-3 h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
          <textarea placeholder="Content (rich text)" className="clay-input w-full p-3 h-32" value={content} onChange={(e) => setContent(e.target.value)} />

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Cover Image</label>
            <div className="flex gap-3">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleCoverImageSelect}
                className="flex-1 clay-input p-3 text-gray-400"
              />
            </div>
            {coverImagePreview && (
              <div className="relative w-40 h-40 rounded overflow-hidden bg-gray-800">
                <img src={coverImagePreview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <input type="text" placeholder="Project link (GitHub or live)" className="clay-input w-full p-3" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} />
          <textarea placeholder="Problem (what was the problem/brief)" className="clay-input w-full p-3 h-20" value={problem} onChange={(e) => setProblem(e.target.value)} />
          <textarea placeholder="Solution (how you solved it)" className="clay-input w-full p-3 h-20" value={solution} onChange={(e) => setSolution(e.target.value)} />

          <input type="text" placeholder="Tech (comma-separated)" className="clay-input w-full p-3" value={tech} onChange={(e) => setTech(e.target.value)} />
          <div className="flex gap-3">
            <button 
              onClick={editing ? handleUpdate : handleAdd} 
              disabled={uploading}
              className="clay-btn-accent flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <PlusCircle size={18} /> {uploading ? 'Uploading...' : (editing ? 'Update' : 'Add')}
            </button>
            {editing && (
              <button onClick={cancelEdit} className="clay-btn flex-1 py-3 rounded-lg font-bold text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map(cs => (
          <div key={cs.id} className="clay-card p-4 flex flex-col">
            {cs.coverImage && <img src={cs.coverImage} alt={cs.title} className="w-full h-40 object-cover rounded mb-3" />}
            <h4 className="text-white font-bold mb-1">{cs.title}</h4>
            <p className="text-gray-500 text-sm mb-2">{cs.category}</p>
            <p className="text-gray-300 text-sm mb-2">{cs.description}</p>
            {((cs as any).problem) && (
              <div className="mb-2">
                <div className="text-sm font-semibold text-[#00ffff]">Problem</div>
                <p className="text-gray-300 text-sm">{(cs as any).problem}</p>
              </div>
            )}
            {((cs as any).solution) && (
              <div className="mb-2">
                <div className="text-sm font-semibold text-[#00ffff]">Solution</div>
                <p className="text-gray-300 text-sm">{(cs as any).solution}</p>
              </div>
            )}
            {((cs as any).projectLink) && (
              <a href={(cs as any).projectLink} target="_blank" rel="noreferrer" className="mt-2 text-sm text-[#00ffff] underline">View Project</a>
            )}
            {cs.tech.length > 0 && <div className="flex flex-wrap gap-1 mt-3"><span className="text-xs text-gray-500">{cs.tech.join(', ')}</span></div>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => startEdit(cs)} className="text-[#00ffff] p-2 hover:bg-[#00ffff]/10 rounded-lg transition"><Settings size={16} /></button>
              <button onClick={() => handleDelete(cs.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
