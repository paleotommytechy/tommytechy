import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { 
  Home, 
  User, 
  Briefcase, 
  Code, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Instagram, 
  Menu, 
  X,
  Database,
  Cloud,
  Layers,
  Layout,
  Cpu,
  Send,
  Terminal,
  Settings,
  PlusCircle,
  Trash2,
  ExternalLink,
  Quote, // Added for testimonials icon
  MessageSquare // Added MessageSquare
} from "lucide-react";
import TestimonialsPage from './src/testimonials'; // Import TestimonialsPage
import AdminDashboard from './src/admin'; // Import new Admin Dashboard
import LoginPage from './src/login';
import { supabase } from './lib/supabase';
import { getServices } from './lib/services';
import { getGalleryProjects } from './lib/gallery';
import { getCaseStudies } from './lib/caseStudies';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';

// --- Types ---

type Section = "home" | "about" | "services" | "casestudies" | "work" | "testimonials" | "contact" | "admin"; // Added "testimonials"

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tech: string[];
}

interface Testimonial {
  id: number;
  name: string;
  title: string; // Added title property
  text: string;
  avatar?: string;
}

// --- Mock Data ---

const initialProjects: Project[] = [
  {
    id: 1,
    title: "EcoTrack IoT",
    category: "Embedded & Web",
    description: "Real-time environmental monitoring dashboard using React and ESP32 sensors.",
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1000&q=80",
    tech: ["React", "Tailwind", "C++", "MQTT"]
  },
  {
    id: 2,
    title: "CryptoClay UI",
    category: "Frontend Design",
    description: "A claymorphism-styled cryptocurrency wallet dashboard concept.",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1000&q=80",
    tech: ["React", "Framer Motion", "CSS3"]
  },
  {
    id: 3,
    title: "StudentHub",
    category: "Fullstack",
    description: "A resource sharing platform for engineering students utilizing Supabase.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
    tech: ["Django", "React", "PostgreSQL"]
  }
];

const initialTestimonials: Testimonial[] = [
  { id: 1, name: "Alice Wonderland", title: "CEO, InnovateX", text: "Amazing work, very professional!", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Bob The Builder", title: "Project Manager, Construct Co.", text: "Highly recommend for any project.", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Charlie Chaplin", title: "CTO, Tech Solutions", text: "Exceptional creativity and technical skill.", avatar: "https://i.pravatar.cc/150?img=3" },
];

const services = [
  { title: "Frontend Dev", icon: <Layout className="w-8 h-8" />, desc: "Building responsive, interactive, and accessible interfaces using React and Tailwind." },
  { title: "Backend Dev", icon: <Database className="w-8 h-8" />, desc: "Upcoming expertise in Django and server-side logic for robust applications." },
  { title: "Embedded Systems", icon: <Cpu className="w-8 h-8" />, desc: "Bridging software and hardware with C/C++ and microcontroller programming." },
  { title: "UI/UX Design", icon: <Layers className="w-8 h-8" />, desc: "Creating specific design languages like Neumorphism and Claymorphism." },
  { title: "Branding", icon: <User className="w-8 h-8" />, desc: "Developing digital identities that stand out in the modern web." },
  { title: "Cloud & Tools", icon: <Cloud className="w-8 h-8" />, desc: "Deploying and managing apps with Supabase, Git, and modern CI/CD workflows." },
];

const skills = {
  frontend: ["React", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "JavaScript/TS"],
  backend: ["Django", "Python", "Node.js Basics"],
  embedded: ["Arduino Kit", "Arduino IDE", "Proteus", "Logisim", "Raspberry Pi"],
  tools: ["Git", "GitHub", "Supabase", "VS Code", "Figma"],
  soft: ["Communication", "Teamwork", "Problem Solving", "Adaptability"]
};

// --- Components ---

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pathToSection = (path: string): Section => {
    if (path === '/' || path === '') return 'home';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/case-studies') || path.startsWith('/casestudies')) return 'casestudies';
    if (path.startsWith('/work')) return 'work';
    if (path.startsWith('/testimonials')) return 'testimonials';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/admin')) return 'admin';
    return 'home';
  };

  const activeSection = pathToSection(location.pathname);

  const [navItems] = useState<{ id: Section; label: string; icon: React.ReactNode }[]>([
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'about', label: 'About', icon: <User size={18} /> },
    { id: 'services', label: 'Services', icon: <Briefcase size={18} /> },
    { id: 'casestudies', label: 'Case Studies', icon: <Code size={18} /> },
    { id: 'work', label: 'Gallery', icon: <Layers size={18} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <Quote size={18} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={18} /> },
  ]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="text-2xl font-extrabold text-white tracking-tight cursor-pointer flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <span className="text-aqua text-shadow-glow text-[#00ffff]">Tommytechy.</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-4 clay-card px-6 py-3 !rounded-full !box-shadow-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id === 'home' ? '/' : item.id === 'casestudies' ? '/case-studies' : `/${item.id}`)}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-sm font-semibold
                ${activeSection === item.id 
                  ? "bg-[#00ffff] text-[#1a1b1e] shadow-lg shadow-[#00ffff]/20" 
                  : "text-gray-400 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <button 
          className="md:hidden clay-btn w-12 h-12 text-[#00ffff]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="absolute top-20 right-6 w-64 clay-card p-4 flex flex-col gap-3 md:hidden z-50 bg-[#1a1b1e]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.id === 'home' ? '/' : item.id === 'casestudies' ? '/case-studies' : `/${item.id}`);
                setIsOpen(false);
              }}
              className={`p-3 rounded-xl flex items-center gap-3 text-left font-medium
                ${activeSection === item.id 
                  ? "bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/20" 
                  : "text-gray-400 hover:bg-white/5"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
           <button
              onClick={() => {
                navigate('/admin');
                setIsOpen(false);
              }}
              className="p-3 rounded-xl flex items-center gap-3 text-left font-medium text-gray-500 mt-4 border-t border-gray-800 pt-4"
            >
              <Settings size={18} />
              Admin
            </button>
        </div>
      )}
    </nav>
  );
};

const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="blob w-96 h-96 bg-[#00ffff] rounded-full top-[-10%] left-[-10%] opacity-[0.07]"></div>
      <div className="blob w-80 h-80 bg-purple-500 rounded-full bottom-[-10%] right-[-5%] opacity-[0.05] animation-delay-2000"></div>
      <div className="blob w-64 h-64 bg-[#00ffff] rounded-full top-[40%] right-[20%] opacity-[0.03] animation-delay-4000"></div>
    </div>
  );
};

// --- Sections ---

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 space-y-8 z-10">
          <div className="inline-block px-4 py-2 rounded-full bg-[#00ffff]/10 border border-[#00ffff]/20 text-[#00ffff] text-sm font-bold tracking-wide mb-2">
            COMPUTER ENGINEERING STUDENT
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
            Hi, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-blue-500 text-glow">
              Olusegun Ifeoluwa.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
            I am a <strong className="text-gray-200">Frontend Developer</strong> and <strong className="text-gray-200">Embedded Systems Enthusiast</strong> crafting soft, 3D-styled digital experiences and bridging hardware with software.
          </p>
          <div className="flex gap-6 pt-4">
            <button 
              onClick={() => navigate('/contact')}
              className="clay-btn-accent px-8 py-4 rounded-full font-bold text-lg transition-transform hover:-translate-y-1"
            >
              Hire Me
            </button>
            <button 
              onClick={() => navigate('/work')}
              className="clay-btn px-8 py-4 text-white hover:text-[#00ffff] transition-colors"
            >
              View Work
            </button>
            <a
              href="/my_cv.pdf"
              download
              className="clay-btn px-8 py-4 text-white hover:text-[#00ffff] transition-colors"
            >
              Download CV
            </a>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-12">
            {['React', 'Embedded', 'Django'].map((item, i) => (
              <div key={i} className="clay-card p-4 text-center text-sm font-bold text-gray-400 hover:text-[#00ffff]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2 relative z-10 flex justify-center">
          <div className="relative w-80 h-80 lg:w-[500px] lg:h-[500px]">
            {/* Decorative shapes behind image */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff] to-blue-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute top-10 right-10 w-20 h-20 clay-card rounded-full bg-[#1a1b1e] z-0 animate-bounce delay-700"></div>
            <div className="absolute bottom-20 left-0 w-32 h-32 clay-card rounded-full bg-[#1a1b1e] z-0 animate-pulse"></div>
            
            {/* Profile Image */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="clay-card w-64 h-64 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-[#1a1b1e] flex items-center justify-center bg-[#25262a]">
                 <img 
                  src="/profile.jpeg" 
                  alt="Olusegun Ifeoluwa" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
          <div className="h-1 w-20 bg-[#00ffff] mx-auto rounded-full shadow-[0_0_10px_#00ffff]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Profile & Pedestal */}
          <div className="col-span-1 flex flex-col items-center">
            <div className="relative w-64 h-64 mx-auto mb-8">
              <div className="absolute bottom-0 w-full h-12 bg-[#1a1b1e] shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.1)] rounded-[100%] z-0"></div>
              <div className="absolute bottom-8 inset-x-4 top-4 clay-card flex items-center justify-center z-10 overflow-hidden bg-gray-800">
                <img 
                  src="/profile.jpeg" 
                  alt="Olusegun Ifeoluwa" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-4 w-full text-center">
                <span className="text-[#00ffff] font-bold tracking-wider text-sm">THE CREATOR</span>
              </div>
            </div>
            
            <div className="clay-card p-6 w-full text-center space-y-4">
              <h3 className="text-xl font-bold text-white">Olusegun Ifeoluwa Tomiwa</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A Computer Engineering Student driven by the fusion of hardware logic and software beauty.
              </p>
            </div>
          </div>

          {/* Bio & Timeline */}
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="clay-card p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-[#00ffff] opacity-5 rounded-bl-full"></div>
               <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                 <Terminal className="text-[#00ffff}" /> What I Do
               </h3>
               <p className="text-gray-300 leading-relaxed mb-4">
                 I am currently mastering the art of <strong>Frontend Development</strong> while exploring the depths of <strong>Embedded Systems</strong>. My journey is evolving towards becoming a robust <strong>Backend Engineer</strong>, creating a full circle of competence from silicon to screen.
               </p>
               <p className="text-gray-300 leading-relaxed">
                 I specialize in building intuitive, accessible, and visually striking interfaces, focusing on clean code and modern architecture.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Frontend */}
              <div className="clay-card p-6">
                <h4 className="text-[#00ffff] font-bold mb-4 border-b border-gray-700 pb-2">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map(s => (
                    <span key={s} className="px-3 py-1 bg-[#1a1b1e] shadow-[inset_3px_3px_6px_#121315,inset_-3px_-3px_6px_#222327] rounded-full text-xs text-gray-300">{s}</span>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div className="clay-card p-6">
                <h4 className="text-[#00ffff] font-bold mb-4 border-b border-gray-700 pb-2">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.backend.map(s => (
                    <span key={s} className="px-3 py-1 bg-[#1a1b1e] shadow-[inset_3px_3px_6px_#121315,inset_-3px_-3px_6px_#222327] rounded-full text-xs text-gray-300">{s}</span>
                  ))}
                </div>
              </div>

              {/* Embedded Systems */}
              <div className="clay-card p-6">
                <h4 className="text-[#00ffff] font-bold mb-4 border-b border-gray-700 pb-2">Embedded Systems</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.embedded.map(s => (
                    <span key={s} className="px-3 py-1 bg-[#1a1b1e] shadow-[inset_3px_3px_6px_#121315,inset_-3px_-3px_6px_#222327] rounded-full text-xs text-gray-300">{s}</span>
                  ))}
                </div>
              </div>

              {/* Tools & Cloud */}
              <div className="clay-card p-6">
                <h4 className="text-[#00ffff] font-bold mb-4 border-b border-gray-700 pb-2">Tools & Cloud</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map(s => (
                    <span key={s} className="px-3 py-1 bg-[#1a1b1e] shadow-[inset_3px_3px_6px_#121315,inset_-3px_-3px_6px_#222327] rounded-full text-xs text-gray-300">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Soft Skills */}
            <div className="clay-card p-6">
                <h4 className="text-[#00ffff] font-bold mb-4 border-b border-gray-700 pb-2">Soft Skills</h4>
                <div className="flex flex-wrap gap-3">
                  {skills.soft.map(s => (
                     <div key={s} className="flex items-center gap-2 text-gray-300">
                       <div className="w-2 h-2 rounded-full bg-[#00ffff]"></div>
                       {s}
                     </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesPage = () => {
  const [servicesData, setServicesData] = useState<{ id: number; title: string; desc: string; icon?: string }[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoadingServices(true);
      try {
        const data = await getServices();
        if (mounted && data && data.length > 0) setServicesData(data.map(s => ({ id: s.id, title: s.title, desc: s.desc, icon: s.icon })));
      } finally {
        if (mounted) setLoadingServices(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const displayServices = servicesData.length > 0 ? servicesData : services;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Services</h2>
          <p className="text-gray-400">High-quality digital solutions tailored to your needs.</p>
        </div>

        {loadingServices ? (
          <div className="text-center text-gray-400">Loading services...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service: any, idx: number) => (
              <div key={service.id ?? idx} className="clay-card p-8 hover:z-10 relative group">
                <div className="w-16 h-16 rounded-2xl bg-[#1a1b1e] shadow-[inset_4px_4px_8px_#121315,inset_-4px_-4px_8px_#222327] flex items-center justify-center text-[#00ffff] mb-6 group-hover:scale-110 transition-transform duration-300">
                  {/* if icon is a string (e.g., icon name), you can render conditionally here */}
                  {service.icon ? <span className="text-sm">{service.icon}</span> : <Layout className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00ffff] transition-colors">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CaseStudiesPage = () => {
  const [caseStudies, setCaseStudies] = React.useState<typeof initialProjects>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getCaseStudies();
        if (mounted) setCaseStudies(data && data.length > 0 ? data as any : initialProjects);
      } catch (e) {
        console.error('Failed to load case studies', e);
        if (mounted) setCaseStudies(initialProjects);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Case Studies</h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading case studies...</div>
        ) : (
          <div className="space-y-12">
            {caseStudies.map((project: any, index: number) => (
              <div key={project.id || index} className="clay-card p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className={`order-1 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'} rounded-2xl overflow-hidden h-64 w-full relative bg-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]`}>
                  <img src={project.coverImage || project.image || project.image_url} alt={project.title} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b1e] to-transparent opacity-60"></div>
                </div>

                <div className={`order-2 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} space-y-4`}>
                  <div className="text-[#00ffff] text-sm font-bold tracking-wider uppercase">{project.category}</div>
                  <h3 className="text-3xl font-bold text-white">{project.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {project.description}
                  </p>

                  {(project.problem || project.solution) && (
                    <div className="mt-4 text-left">
                      {project.problem && (
                        <div className="mb-2">
                          <div className="text-sm font-semibold text-[#00ffff]">Problem</div>
                          <p className="text-gray-300 text-sm">{project.problem}</p>
                        </div>
                      )}
                      {project.solution && (
                        <div className="mb-2">
                          <div className="text-sm font-semibold text-[#00ffff]">Solution</div>
                          <p className="text-gray-300 text-sm">{project.solution}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {(project.tech || []).map((t: string) => (
                      <span key={t} className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-400">{t}</span>
                    ))}
                  </div>

                  {project.projectLink ? (
                    <a href={project.projectLink} target="_blank" rel="noreferrer" className="mt-4 inline-block clay-btn px-6 py-2 text-sm text-[#00ffff] flex items-center gap-2 hover:gap-3 transition-all">
                      View Project <ExternalLink size={14}/>
                    </a>
                  ) : (
                    <button className="mt-4 clay-btn px-6 py-2 text-sm text-[#00ffff] flex items-center gap-2 hover:gap-3 transition-all">
                      View Case Study <ExternalLink size={14}/>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const WorkGallery = () => {
  // Tilt logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
    const rotateY = ((x - centerX) / centerX) * 10;

    const inner = card.querySelector('.tilt-inner') as HTMLElement;
    if (inner) {
      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector('.tilt-inner') as HTMLElement;
    if (inner) {
      inner.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
    }
  };

  const [projects, setProjects] = useState<typeof initialProjects>(initialProjects);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoadingGallery(true);
      try {
        const data = await getGalleryProjects();
        if (mounted && data && data.length > 0) {
          setProjects(data as any);
        }
      } finally {
        if (mounted) setLoadingGallery(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Work Gallery</h2>
          <p className="text-gray-400">Interactive 3D cards. Hover to explore depth.</p>
        </div>

        {loadingGallery ? (
          <div className="text-center text-gray-400">Loading gallery...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="h-80 w-full relative"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="tilt-inner w-full h-full clay-card p-6 flex flex-col justify-between transition-transform duration-100 ease-out transform-style-3d bg-[#1a1b1e]">
                  {/* Floating Content */}
                  <div className="relative z-20 transform translate-z-10">
                    <div className="text-[#00ffff] text-xs font-bold mb-2">{project.category}</div>
                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                  </div>

                  <div className="absolute inset-0 rounded-2xl overflow-hidden z-0 opacity-30">
                     <img src={project.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="" />
                  </div>

                  <div className="relative z-20 mt-auto">
                    <div className="flex gap-2 flex-wrap">
                       {(project.tech || []).slice(0,3).map((t: string) => (
                         <span key={t} className="text-[10px] bg-black/50 px-2 py-1 rounded text-white backdrop-blur-sm">{t}</span>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        <div>
          <h2 className="text-4xl font-bold text-white mb-6">Let's Connect</h2>
          <p className="text-gray-400 mb-10">
            Whether you have a project in mind or just want to chat about embedded systems, I'm here.
          </p>

          <div className="space-y-6">
            <a href="mailto:olusegunifetomiwa2000@gmail.com" className="clay-card p-4 flex items-center gap-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#1a1b1e] shadow-[inset_2px_2px_4px_#0f1012,inset_-2px_-2px_4px_#25272b] flex items-center justify-center text-[#00ffff]">
                <Mail size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-white font-medium break-all">olusegunifetomiwa2000@gmail.com</div>
              </div>
            </a>

            <a href="https://wa.me/2349028168649" className="clay-card p-4 flex items-center gap-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#1a1b1e] shadow-[inset_2px_2px_4px_#0f1012,inset_-2px_-2px_4px_#25272b] flex items-center justify-center text-green-500">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500">WhatsApp</div>
                <div className="text-white font-medium">09028168649</div>
              </div>
            </a>
            
            <div className="clay-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1a1b1e] shadow-[inset_2px_2px_4px_#0f1012,inset_-2px_-2px_4px_#25272b] flex items-center justify-center text-red-500">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500">Hotline</div>
                <div className="text-white font-medium">08163202841</div>
              </div>
            </div>

            <a href="https://github.com/paleotommytechy" target="_blank" rel="noreferrer" className="clay-card p-4 flex items-center gap-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#1a1b1e] shadow-[inset_2px_2px_4px_#0f1012,inset_-2px_-2px_4px_#25272b] flex items-center justify-center text-white">
                <Github size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500">GitHub</div>
                <div className="text-white font-medium">paleotommytechy</div>
              </div>
            </a>
          </div>
          
          <div className="flex gap-4 mt-8">
             {[<Linkedin key="l" />, <Instagram key="i" />, <Code key="c" />].map((icon, i) => (
               <div key={i} className="w-12 h-12 rounded-full clay-btn text-gray-400 hover:text-[#00ffff]">
                 {icon}
               </div>
             ))}
          </div>
        </div>

        <div className="clay-card p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Send Message</h3>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-2">Name</label>
              <input type="text" className="clay-input w-full p-4" placeholder="Tomiwa Ifeoluwa" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-2">Email</label>
              <input type="email" className="clay-input w-full p-4" placeholder="olusegunifetomiwa2000@gmail.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-2">Message</label>
              <textarea className="clay-input w-full p-4 h-32 resize-none" placeholder="Your project details..."></textarea>
            </div>
            <button className="clay-btn-accent w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
              <Send size={20} /> Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

interface ProjectAdminProps {
  projects: Project[];
  addProject: (title: string, category: string, description: string, image: string, tech: string[]) => void;
  editProject: (id: number, newTitle: string, newCategory: string, newDescription: string, newImage: string, newTech: string[]) => void;
  deleteProject: (id: number) => void;
  isCaseStudy?: boolean; // New prop to differentiate
}

// Old admin components removed; now imported from src/admin.tsx with Supabase integration






// Old AdminPanel and AdminDashboard components removed; now imported from src/admin.tsx
// which connects directly to Supabase for CRUD operations.


// --- Main App ---

const App = () => {
  return (
    <div className="min-h-screen text-gray-100 font-sans selection:bg-[#00ffff] selection:text-black">
      <FloatingShapes />
      
      <Navigation />

      <main className="relative z-10 transition-opacity duration-500">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/work" element={<WorkGallery />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>

      <footer className="relative z-10 py-8 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Olusegun Ifeoluwa Tomiwa.</p>
      </footer>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

// ProtectedRoute component: enforces Supabase authentication only (no email allowlist)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        // Only check if session exists; no email allowlist
        setIsAuthenticated(!!data?.session);
        if (!data?.session) {
          navigate('/login');
        }
      } catch (err) {
        if (mounted) {
          setIsAuthenticated(false);
          navigate('/login');
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setIsAuthenticated(!!session);
        if (!session) {
          navigate('/login');
        }
      }
    });

    return () => {
      mounted = false;
      try { listener.subscription.unsubscribe(); } catch (e) {}
    };
  }, [navigate]);

  // While checking auth, show loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1012]">
        <div className="clay-card p-8 text-center space-y-4">
          <div className="animate-pulse text-gray-300">Checking authentication…</div>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return null; // Already navigated to /login in useEffect
  }

  return <>{children}</>;
};