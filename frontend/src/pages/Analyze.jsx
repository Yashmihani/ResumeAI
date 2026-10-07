import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/client';
import {
  ScanText,
  FileText,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Calculator,
  HelpCircle,
  RefreshCw,
  Award
} from 'lucide-react';

const SAMPLE_JOBS = [
  {
    title: 'Python Developer',
    description:
      'We are looking for a dedicated Python Developer to join our backend engineering team. ' +
      'Required skills and qualifications include proficiency in Python, SQL, Machine Learning concepts, ' +
      'Git version control, and containerization using Docker. Familiarity with REST API architecture and ' +
      'relational databases like MySQL is highly valued.',
  },
  {
    title: 'Machine Learning Engineer',
    description:
      'Seeking a skilled Machine Learning Engineer with practical expertise in Python, Machine Learning, ' +
      'Natural Language Processing (NLP), TensorFlow, Pandas, and NumPy. Responsibilities include building ' +
      'predictive ML models, vector preprocessing, and evaluating model pipelines for production systems.',
  },
  {
    title: 'Full Stack Developer',
    description:
      'We are hiring a Full Stack Developer proficient in React, Node.js, JavaScript, HTML, and CSS. ' +
      'Candidates should be comfortable managing database queries in SQL and developing clean, responsive ' +
      'candidate-facing web applications with modern REST APIs.',
  },
];

const Analyze = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobTitle, setJobTitle] = useState('Python Developer');
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOBS[0].description);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes/my');
      setResumes(res.data);
      if (res.data.length > 0) {
        setSelectedResumeId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    }
  };

  const handleSelectSample = (sample) => {
    setJobTitle(sample.title);
    setJobDescription(sample.description);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedResumeId && resumes.length === 0) {
      setError('Please upload a resume first before running an NLP analysis.');
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 15) {
      setError('Please provide a descriptive job requirement text (minimum 15 characters).');
      return;
    }

    try {
      setAnalyzing(true);
      const payload = {
        resume_id: selectedResumeId ? parseInt(selectedResumeId) : undefined,
        job_title: jobTitle.trim() || 'Target Job Position',
        job_description: jobDescription.trim(),
      };
      const res = await api.post('/analysis/analyze', payload);
      setResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Analysis failed. Please check inputs and try again.';
      setError(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Layout
      title="Analyze Resume & Job Matching"
      subtitle="TF-IDF Vectorization, Cosine Angle Calculation & Skill Extraction"
    >
      <div className="space-y-6 max-w-5xl">
        {/* Input Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Job Description Matching Setup
              </h3>
              <p className="text-xs text-slate-500">
                Select your candidate resume and enter target job requirements to calculate similarity.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resumes.length === 0 ? (
            <div className="mt-4 p-6 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="w-4 h-4" />
                <span>No Resume Uploaded</span>
              </div>
              <p>You must upload a PDF resume before analyzing it against job descriptions.</p>
              <a
                href="/resume"
                className="inline-block mt-2 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded font-bold text-xs"
              >
                Go to My Resume to Upload PDF →
              </a>
            </div>
          ) : (
            <form onSubmit={handleAnalyze} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Select Uploaded Resume
                  </label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.filename} ({r.skills_count} detected skills)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Target Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Python Developer"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Sample Quick-Load Buttons (Section 26) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Job Description Content
                  </label>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400 text-[11px]">Load Demo Sample:</span>
                    {SAMPLE_JOBS.map((s) => (
                      <button
                        key={s.title}
                        type="button"
                        onClick={() => handleSelectSample(s)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                          jobTitle === s.title
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={6}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job description requirements here..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none font-sans leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={analyzing}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing NLP Pipeline & Calculating Cosine Similarity...</span>
                    </>
                  ) : (
                    <>
                      <ScanText className="w-4 h-4" />
                      <span>Analyze Resume & Calculate Match Score</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* NLP Results Presentation (Section 15, 16, 17) */}
        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-base text-slate-900">
                    NLP Screening Match Results
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Target: <strong className="text-slate-800">{result.job_title}</strong>
                </span>
              </div>

              {/* Match Score Display Card (Section 15) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-center">
                {/* Visual Score Column */}
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    RESUME MATCH SCORE
                  </span>
                  <div className="text-5xl font-black text-emerald-700 my-2 tracking-tight">
                    {result.match_score}%
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                      result.match_score >= 80
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : result.match_score >= 60
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : result.match_score >= 40
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {result.match_score >= 80 ? '🟢 Strong Match (80%–100%)' :
                     result.match_score >= 60 ? '🔵 Good Match (60%–79%)' :
                     result.match_score >= 40 ? '🟡 Moderate Match (40%–59%)' :
                     '🔴 Weak Match (0%–39%)'}
                  </span>

                  <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${result.match_score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Recommendation & Academic Rationale Column */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                      Recommendation Assessment
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
                      <strong>{result.classification}:</strong> {result.recommendation}
                    </p>
                  </div>

                  {/* Academic Disclaimer Callout (Section 15) */}
                  <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Academic Clarification</span>
                    </div>
                    <p className="italic">
                      "The match percentage represents textual similarity calculated using the implemented NLP method (TF-IDF vector representation and cosine angle). It is not a guaranteed probability of getting hired."
                    </p>
                  </div>
                </div>
              </div>

              {/* Matched and Missing Skills Badges (Section 16) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                {/* Matched Skills */}
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Matched Skills ({result.matched_skills.length})
                    </span>
                  </div>
                  {result.matched_skills.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No direct predefined skill overlaps detected.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {result.matched_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold flex items-center gap-1"
                        >
                          <span>✓</span>
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Missing Skills */}
                <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      Missing Skills from Job Requirements ({result.missing_skills.length})
                    </span>
                  </div>
                  {result.missing_skills.length === 0 ? (
                    <p className="text-xs text-emerald-700 font-semibold">
                      ✓ All required job technical skills are covered in your resume!
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {result.missing_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded bg-rose-100 text-rose-900 border border-rose-300 text-xs font-semibold flex items-center gap-1"
                        >
                          <span>✗</span>
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* All Skills Detected Breakdown */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">
                    All Resume Skills ({result.resume_skills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {result.resume_skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">
                    Job Required Skills ({result.job_skills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {result.job_skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Database Save Confirmation */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  ✓ Analysis record automatically saved to SQLite database table: <code>analyses</code>
                </span>
                <a href="/history" className="text-emerald-700 font-bold hover:underline">
                  View in History →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analyze;
