import React, { useState } from 'react';

// --- Component ---

interface Testimonial {
  id: number;
  name: string;
  text: string;
  avatar?: string;
  company?: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Jane Doe",
    text: "Tommytechy delivered an outstanding website for my business. The design is sleek, and the functionality is perfect. Highly recommend!",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    company: "Tech Solutions Inc."
  },
  {
    id: 2,
    name: "John Smith",
    text: "The embedded systems work was top-notch. They seamlessly integrated our hardware with their custom software. Excellent communication throughout the project.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    company: "Global Robotics"
  },
  {
    id: 3,
    name: "Alice Johnson",
    text: "I was impressed with the UI/UX design. My app now looks modern and is incredibly user-friendly. A true professional!",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    company: "Creative Designs"
  },
  {
    id: 4,
    name: "Robert Brown",
    text: "From concept to deployment, Tommytechy made the process smooth. Their attention to detail and technical skills are remarkable.",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    company: "Innovative Startups"
  },
];

const TestimonialsPage = () => {
  const [testimonials] = useState<Testimonial[]>(mockTestimonials);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-gray-400 text-lg">Hear directly from those who've experienced our service.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="clay-card p-8 text-center flex flex-col items-center justify-between">
              {testimonial.avatar && (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-gray-700 object-cover"
                />
              )}
              <p className="text-gray-300 italic mb-6 flex-grow">"{testimonial.text}"</p>
              <div className="mt-auto">
                <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                {testimonial.company && (
                    <p className="text-gray-500 text-sm mt-1">{testimonial.company}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
            <div className="text-center text-gray-400 text-lg mt-10">
                No testimonials found.
            </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;