import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/client';
import {
  History as HistoryIcon,
  Search,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Award,
  ArrowRight
} from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analysis/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = history.filter((item) =>
    item.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.job_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout
      title="Analysis History"
      subtitle="Historical Records of Resume vs Job Description NLP Screenings"
    >
      <div className="space-y-6 max-w-5xl">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header & Search Bar */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Evaluation History Database
              </h3>
              <p className="text-xs text-slate-500">
                Stored records from SQLite database (<code>resume_ai.db</code>) — table: <code>analyses</code>
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by job title..."
                className="text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none w-56"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs font-semibold">
              Loading historical analyses...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <HistoryIcon className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-medium">No analysis history matches found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 text-xs font-bold text-slate-600 border-b border-slate-200">
                    <th className="py-3 px-6">Job Description Target</th>
                    <th className="py-3 px-6">Match Score</th>
                    <th className="py-3 px-6">Recommendation</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-6">
                        <strong className="text-slate-900 block">{item.job_title}</strong>
                        <span className="text-xs text-slate-500">
                          {item.matched_skills.length} matched skills
                        </span>
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
                      <td className="py-3.5 px-6 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right text-xs">
                        <button
                          onClick={() => setSelectedRecord(item)}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded border border-emerald-200 transition-colors"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal / Detailed Viewer for Selected Record */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-mono text-emerald-700 font-bold uppercase">
                    Analysis Record #{selectedRecord.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedRecord.job_title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 rounded bg-slate-100"
                >
                  ✕ Close
                </button>
              </div>

              {/* Score Highlight Box */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Recorded Match Score
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-700">
                    {selectedRecord.match_score}%
                  </div>
                  <span className="text-xs font-bold text-emerald-900">
                    {selectedRecord.classification}
                  </span>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>Evaluated on:</span>
                  <div className="font-semibold text-slate-700">
                    {new Date(selectedRecord.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  NLP Recommendation:
                </h4>
                <p className="text-xs text-slate-700 p-3 bg-slate-50 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedRecord.recommendation}
                </p>
              </div>

              {/* Matched & Missing Skills Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Matched Skills ({selectedRecord.matched_skills?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(selectedRecord.matched_skills || []).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-medium text-[11px]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-900 block mb-1.5 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Missing Skills ({selectedRecord.missing_skills?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(selectedRecord.missing_skills || []).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-medium text-[11px]">
                        ✗ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Job Description Text */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Full Job Description Evaluated:
                </h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 max-h-36 overflow-y-auto font-sans leading-relaxed">
                  {selectedRecord.job_description}
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-1.5 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;
