import React from 'react';
import { ArrowRight, BookOpen, Layers, FileCode, CheckCircle2 } from 'lucide-react';

const NlpFlowDiagram = () => {
  const steps = [
    { num: '01', title: 'PDF Extraction', desc: 'pdfplumber text stream' },
    { num: '02', title: 'Cleaning & Lowercase', desc: 'Regex & URL filtering' },
    { num: '03', title: 'Tokenization', desc: 'NLTK word_tokenize' },
    { num: '04', title: 'Stopword Removal', desc: 'NLTK english corpus' },
    { num: '05', title: 'Lemmatization', desc: 'WordNetLemmatizer' },
    { num: '06', title: 'Skill Extraction', desc: 'Pattern dictionary match' },
    { num: '07', title: 'TF-IDF Matrix', desc: 'Scikit-learn vectorizer' },
    { num: '08', title: 'Cosine Similarity', desc: 'cos(θ) Vector score' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Academic NLP Pipeline Architecture
          </h4>
        </div>
        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-semibold">
          formula: cos(A, B) = (A · B) / (||A|| × ||B||)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mt-4">
        {steps.map((s, idx) => (
          <div
            key={s.num}
            className={`p-3 rounded-lg border text-center transition-all ${
              idx === 7
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span
              className={`block text-[10px] font-mono font-bold ${
                idx === 7 ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              Step {s.num}
            </span>
            <span
              className={`block text-xs font-bold mt-0.5 ${
                idx === 7 ? 'text-emerald-900' : 'text-slate-800'
              }`}
            >
              {s.title}
            </span>
            <span className="block text-[10px] text-slate-500 mt-1 leading-tight">
              {s.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NlpFlowDiagram;
