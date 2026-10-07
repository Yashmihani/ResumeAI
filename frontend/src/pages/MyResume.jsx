import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/client';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  Cpu,
  Clock,
  Sparkles,
  Eye,
  FileCheck
} from 'lucide-react';

const MyResume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedResumeText, setSelectedResumeText] = useState(null);
  const [viewingResumeId, setViewingResumeId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resumes/my');
      setResumes(res.data);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid file type. Only PDF resumes (.pdf) are permitted.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10 MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setError('');
      setSuccess('');
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(`✓ Resume uploaded successfully! Detected ${res.data.skills_count} domain skills.`);
      fetchResumes();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to extract text from PDF. Please ensure the PDF is text-based and readable.';
      setError(msg);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      fetchResumes();
      if (viewingResumeId === id) {
        setSelectedResumeText(null);
        setViewingResumeId(null);
      }
    } catch (err) {
      setError('Failed to delete resume.');
    }
  };

  const handleInspectText = async (id) => {
    if (viewingResumeId === id) {
      setViewingResumeId(null);
      setSelectedResumeText(null);
      return;
    }
    try {
      const res = await api.get(`/resumes/${id}`);
      setSelectedResumeText(res.data.extracted_text);
      setViewingResumeId(id);
    } catch (err) {
      setError('Failed to load resume details.');
    }
  };

  return (
    <Layout
      title="My Resume Management"
      subtitle="PDF Document Parsing, OCR/Text Extraction & Skill Identification"
    >
      <div className="space-y-6 max-w-5xl">
        {/* Upload Zone Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-1">
            Upload Candidate Resume (PDF)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Upload your text-based resume in PDF format. The system automatically extracts text using <code>pdfplumber</code> and identifies technical skills.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-semibold">{success}</span>
            </div>
          )}

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs inline-block transition-colors">
                  {uploading ? 'Extracting Text...' : 'Select PDF Resume'}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  disabled={uploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500 mt-2">
                Supported: PDF only (Maximum file size: 10 MB)
              </p>
            </div>

            {uploading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
                <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                <span>Parsing PDF stream with pdfplumber & extracting skills...</span>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Resumes List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Stored Resumes in Database</h3>
              <p className="text-xs text-slate-500">Managed in SQLite table: <code>resumes</code></p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded">
              {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'} Available
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs font-semibold">
              Loading resume records...
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-medium">No resumes uploaded yet. Upload one above to begin.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {resumes.map((item, index) => (
                <div key={item.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{item.filename}</h4>
                          {index === 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Active / Latest
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Uploaded: {new Date(item.uploaded_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-emerald-700">
                            <Cpu className="w-3 h-3 text-emerald-600" />
                            {item.skills_count} Skills Detected
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleInspectText(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{viewingResumeId === item.id ? 'Hide Text' : 'View Extracted Text'}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Skills Badges */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                      Extracted Technical Skills ({item.detected_skills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.detected_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Collapsible Extracted Text Viewer */}
                  {viewingResumeId === item.id && selectedResumeText && (
                    <div className="mt-4 p-4 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono max-h-64 overflow-y-auto border border-slate-800 shadow-inner">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                        <span>Extracted Raw Text Stream (pdfplumber):</span>
                        <span>{selectedResumeText.length} characters</span>
                      </div>
                      <pre className="whitespace-pre-wrap leading-relaxed">{selectedResumeText}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyResume;
