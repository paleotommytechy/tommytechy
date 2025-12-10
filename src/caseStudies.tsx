import React, { useState, useEffect } from 'react';
import { getCaseStudies, CaseStudy } from '../lib/caseStudies';

const CaseStudiesPage: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      setLoading(true);
      const data = await getCaseStudies();
      setCaseStudies(data);
      setLoading(false);
    };

    fetchCaseStudies();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Case Studies</h2>
          <p className="text-gray-400 text-lg">Explore projects we've delivered and the impact they produced.</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 text-lg mt-10">Loading case studies...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((cs) => (
                <div key={cs.id} className="clay-card p-6 flex flex-col">
                  {cs.coverImage && (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={cs.coverImage} alt={`Cover image for ${cs.title}`} className="w-full h-40 object-cover rounded mb-4" />
                  )}

                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-white mb-2">{cs.title}</h3>
                    {cs.category && <p className="text-sm text-indigo-300 mb-2">{cs.category}</p>}
                    <p className="text-gray-300 mb-4">{cs.description}</p>
                  </div>

                  {cs.tech && cs.tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cs.tech.map((t, i) => (
                        <span key={i} className="text-xs bg-gray-800 text-gray-200 px-2 py-1 rounded">{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Problem / Solution / Link */}
                  {(cs.problem || cs.solution) && (
                    <div className="mt-4 text-left w-full">
                      {cs.problem && (
                        <div className="mb-2">
                          <div className="text-sm font-semibold text-[#00ffff]">Problem</div>
                          <p className="text-gray-300 text-sm">{cs.problem}</p>
                        </div>
                      )}
                      {cs.solution && (
                        <div className="mb-2">
                          <div className="text-sm font-semibold text-[#00ffff]">Solution</div>
                          <p className="text-gray-300 text-sm">{cs.solution}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {cs.projectLink && (
                    <div className="mt-4 w-full text-left">
                      <a href={cs.projectLink} target="_blank" rel="noreferrer" className="text-sm text-[#00ffff] underline">View Project</a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {caseStudies.length === 0 && (
              <div className="text-center text-gray-400 text-lg mt-10">No case studies found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CaseStudiesPage;
