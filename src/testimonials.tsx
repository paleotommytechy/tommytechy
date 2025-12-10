
import React, { useState, useEffect } from 'react';
import { getTestimonials, Testimonial } from '../lib/testimonials';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-gray-400 text-lg">Hear directly from those who've experienced our service.</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 text-lg mt-10">
            Loading testimonials...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="clay-card p-8 text-center flex flex-col items-center justify-between">
                    <p className="text-gray-300 italic mb-6 flex-grow">"{testimonial.quote}"</p>
                    <div className="mt-auto flex flex-col items-center">
                      {testimonial.avatar && (
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                          <img src={testimonial.avatar} alt={`${testimonial.author} avatar`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h4 className="text-white font-bold text-lg">{testimonial.author}</h4>
                      {testimonial.company && (
                          <p className="text-gray-500 text-sm mt-1">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
              ))}
            </div>

            {testimonials.length === 0 && !loading && (
                <div className="text-center text-gray-400 text-lg mt-10">
                    No testimonials found.
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;
