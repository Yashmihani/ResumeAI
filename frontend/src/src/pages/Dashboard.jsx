import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  FileText,
  BarChart2,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  ArrowRight,
  Upload,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analysis/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      // Fallback data for demonstration if user has not run analyses yet
      setData({
        has_resume: false,
        resume_filename: null,
        skills_count: 0,
        total_analyses: 0,
        average_match: 0,
        latest_match: null,
        recent_analyses: []
      });
    } finally {
      setLoading(false);
    }
  };

  // If user hasn't uploaded or analyzed yet, use elegant demo indicators with prompt
  const hasResume = data?.has_resume;
  const totalAnalyses = data?.total_analyses || 0;
  const avgMatch = data?.average_match || 0;
  const latestMatch = data?.latest_match;
  const recentAnalyses = data?.recent_analyses || [];

  return (
    <Layout
      title="ResumeAI"
      subtitle="Resume Screening and Job Matching System"
    >
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-white rounded-xl border-l-4 border-emerald-600 border-y border-r border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Welcome back, {user?.name || 'Yash'} 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Your resume screening overview and recent job matching results.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Resume Status */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Resume Status
              </span>
              <div className="mt-2 flex items-center gap-2">
                {hasResume ? (
                  <span className="text-xl font-bold text-emerald-700 flex items-center gap-1.5">
                    ✓ Uploaded
                  </span>
                ) : (
                  <span className="text-base font-bold text-slate-400">
                    Not Uploaded Yet
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 truncate">
                {hasResume ? data.resume_filename : 'Upload your PDF resume'}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
              <span>{hasResume ? 'Extracted Skills:' : 'Action:'}</span>
              {hasResume ? (
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {data.skills_count} Detected
                </span>
              ) : (
                <Link to="/resume" className="text-emerald-700 font-bold hover:underline">
                  Upload PDF →
                </Link>
              )}
            </div>
          </div>

          {/* Card 2: Number of Analyses */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Number of Analyses
              </span>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {totalAnalyses}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Stored records in database</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
              <span>Database:</span>
              <span className="font-bold text-slate-700 font-mono text-[11px]">
                SQLite: analyses
              </span>
            </div>
          </div>

          {/* Card 3: Average Match Score */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Average Match Score
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {avgMatch}%
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {avgMatch >= 80 ? 'Strong Match' : avgMatch >= 60 ? 'Good Match' : avgMatch >= 40 ? 'Moderate Match' : 'Mean Score'}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, avgMatch)}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              Across {totalAnalyses} evaluated roles
            </div>
          </div>

          {/* Card 4: Latest Match Score */}
          <div className="bg-white p-5 rounded-xl border-2 border-emerald-600/40 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                Latest Match Score
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-700">
                  {latestMatch !== null && latestMatch !== undefined ? `${latestMatch}%` : 'N/A'}
                </span>
                {latestMatch !== null && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {latestMatch >= 80 ? 'Strong Match' : latestMatch >= 60 ? 'Good Match' : latestMatch >= 40 ? 'Moderate' : 'Weak'}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1 truncate">
                Role: {data?.latest_job_title || 'No analyses yet'}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              Formula: Cosine Similarity Vector Score
            </div>
          </div>
        </div>

        {/* Records & Match Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Analyses Table (2 Columns) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Recent Analysis Records</h3>
                  <p className="text-xs text-slate-500">Stored analysis records from SQLite database</p>
                </div>
                <Link
                  to="/history"
                  className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  View All ({totalAnalyses}) →
                </Link>
              </div>

              {recentAnalyses.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-3">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-medium">No resume analyses recorded yet.</p>
                  <p className="text-xs text-slate-400">
                    Upload your resume and test it against a sample job description to see results.
                  </p>
                  <Link
                    to="/analyze"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 text-white rounded text-xs font-bold hover:bg-emerald-800"
                  >
                    <span>Run First Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-xs font-bold text-slate-600 border-b border-slate-200">
                        <th className="py-3 px-6">Job Description Target</th>
                        <th className="py-3 px-6">Match Score</th>
                        <th className="py-3 px-6">Recommendation</th>
                        <th className="py-3 px-6 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {recentAnalyses.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-6">
                            <strong className="text-slate-900 block">{item.job_title}</strong>
                            <div className="text-xs text-slate-500">
                              Matched: {item.matched_skills.slice(0, 4).join(', ') || 'General Text Match'}
                              {item.matched_skills.length > 4 && ` +${item.matched_skills.length - 4} more`}
                            </div>
                          </td>
                          <td className="py-3.5 px-6 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{item.match_score}%</span>
                              <div className="w-16 bg-slate-100 rounded-full h-1.5 hidden sm:block">
                                <div
                                  className="bg-emerald-600 h-1.5 rounded-full"
                                  style={{ width: `${Math.min(100, item.match_score)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-6">
                            <span
                              className={`px-2.5 py-1 rounded text-xs font-bold border ${
                                item.match_score >= 80
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : item.match_score >= 60
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : item.match_score >= 40
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-rose-100 text-rose-800 border-rose-200'
                              }`}
                            >
                              {item.classification}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right text-xs">
                            <Link
                              to={`/history`}
                              className="text-emerald-700 font-bold hover:underline"
                            >
                              Inspect →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Mathematical & Skill Callout (1 Column) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Latest Match Analysis
              </h3>

              {/* Cosine Formula */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-4 font-mono text-xs">
                <span className="block text-slate-500 text-[10px] font-bold">
                  COSINE FORMULA
                </span>
                <p className="font-bold text-slate-800 mt-1">
                  cosine(A, B) = (A · B) / (||A|| × ||B||)
                </p>
                <p className="text-slate-600 text-[11px] mt-1">
                  Vector A: Resume TF-IDF<br />
                  Vector B: Job Description TF-IDF
                </p>
              </div>

              {/* Latest Match Circular / Big Display */}
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200 mb-4">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Current Match Result
                </span>
                <div className="text-4xl font-extrabold text-emerald-700 my-1">
                  {latestMatch !== null && latestMatch !== undefined ? `${latestMatch}%` : 'N/A'}
                </div>
                <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold">
                  {latestMatch !== null && latestMatch !== undefined ? (latestMatch >= 80 ? 'Strong Match (80%-100%)' : latestMatch >= 60 ? 'Good Match (60%-79%)' : latestMatch >= 40 ? 'Moderate Match (40%-59%)' : 'Weak Match (below 40%)') : 'No analyses yet'}
                </span>
              </div>

              {/* Skill Evaluation Breakdown */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">
                    Matched Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(recentAnalyses[0]?.matched_skills || []).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-medium text-[11px]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">
                    Missing Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(recentAnalyses[0]?.missing_skills || []).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-medium text-[11px]">
                        ✗ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200">
              <Link
                to="/analyze"
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Analyze New Job</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
