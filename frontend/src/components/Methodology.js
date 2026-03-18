import React from 'react';
import { Database, BrainCircuit, Activity, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';

export default function Methodology() {
  const steps = [
    {
      icon: Database,
      title: '1. Data Collection & Preprocessing',
      description: 'Job listing descriptions and requirements are mapped to text features. Identifying metadata like company name and location are preserved for context but isolated from the core semantic analysis to prevent bias.'
    },
    {
      icon: BrainCircuit,
      title: '2. NLP Feature Extraction',
      description: 'Using transformer-based contextual embeddings, unstructured text is converted into high-dimensional vectors. This allows the model to understand the semantic intent behind phrases rather than just simple keyword matching.'
    },
    {
      icon: Activity,
      title: '3. Model Inference (Random Forest / DL)',
      description: 'The extracted features are passed through our trained classification model (trained on the EMSCAD dataset). The model identifies complex non-linear patterns correlated with historical fraudulent postings (e.g., upfront payment requests disguised as equipment fees).'
    },
    {
      icon: ShieldCheck,
      title: '4. Prediction & Risk Scoring',
      description: 'A normalized confidence score (0-100) is generated. The system flags specific high-risk text segments to provide explainability to the user, ensuring the AI decision-making process is transparent.'
    }
  ];

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-6">
          <BookOpen className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">System Methodology</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Understanding the machine learning pipeline powering JobCheck's fraud detection engine.
        </p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-emerald-500/50 via-slate-800 to-transparent md:left-1/2 md:-ml-[1px]"></div>

        <div className="space-y-12 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div key={index} className={`flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} gap-8 group`}>
                
                {/* Visual Node */}
                <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border-2 border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] z-10 shrink-0 md:absolute md:left-1/2 md:-ml-8 group-hover:border-emerald-500 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300`}>
                  <Icon size={24} />
                </div>
                
                {/* Content Box */}
                <div className={`md:w-1/2 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'} w-full pl-20 md:pl-0 pt-2`}>
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden group-hover:border-slate-700 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-start md:justify-start">
                      {isEven && <span className="hidden md:inline text-emerald-500"><ArrowRight size={18} className="rotate-180" /></span>}
                      {step.title}
                      {!isEven && <span className="hidden md:inline text-emerald-500"><ArrowRight size={18} /></span>}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-20 text-center bg-slate-900/50 border border-slate-800 rounded-xl p-8 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-2">Training Data Note</h3>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          The underlying model architecture is designed to handle the <span className="text-emerald-400 font-mono">EMSCAD</span> dataset comprising 18,000+ real and fraudulent job postings, using a split of 80/20 for training and validation to prevent overfitting.
        </p>
      </div>
    </div>
  );
}
