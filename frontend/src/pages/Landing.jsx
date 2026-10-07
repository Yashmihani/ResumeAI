import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Cpu,
  BarChart3,
  CheckCircle,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow">
            RA
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 tracking-tight">ResumeAI</span>
            <span className="block text-[11px] text-slate-500 font-medium">Resume Screening and Job Matching System</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            Register Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Natural Language Processing & Machine Learning</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Resume Screening & <span className="text-emerald-700">Job Matching</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium">
            ResumeAI helps candidates analyze their resume against a job description using Natural Language Processing and similarity-based matching.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold shadow transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started as Candidate</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Existing Candidate Login</span>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">PDF Text & Skill Extraction</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Extracts raw text from resume PDFs using <code>pdfplumber</code> and parses domain technical skills like Python, SQL, Machine Learning, and Docker against a standardized dictionary.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">NLP Text Preprocessing</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Standardizes unstructured text through lowercase conversion, NLTK tokenization, punctuation filtering, English stopword elimination, and WordNet lemmatization.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">TF-IDF & Cosine Similarity</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Converts preprocessed tokens into Term Frequency-Inverse Document Frequency numerical vectors and computes the cosine angle metric to generate an explainable match percentage.
            </p>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs py-6 px-6 sm:px-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-white">ResumeAI</strong> — Resume Screening and Job Matching System
          </div>
          <div className="font-mono text-[11px] text-emerald-400">
            NLP-Powered Resume Matching
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
