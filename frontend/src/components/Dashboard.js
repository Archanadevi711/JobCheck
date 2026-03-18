import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, Activity, Brain, Server, Shield, FileText, ArrowLeft } from 'lucide-react';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  if (!location.state || !location.state.scanResult) {
    return <Navigate to="/" replace />;
  }
  
  const { listing, prediction } = location.state.scanResult;
  
  const riskColor = 
    prediction.risk_level === 'High' ? 'text-red-500' :
    prediction.risk_level === 'Medium' ? 'text-amber-500' : 'text-emerald-500';
    
  const riskBgColor = 
    prediction.risk_level === 'High' ? 'bg-red-500' :
    prediction.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500';

  const riskBgPulse = 
    prediction.risk_level === 'High' ? 'bg-red-500/20' :
    prediction.risk_level === 'Medium' ? 'bg-amber-500/20' : 'bg-emerald-500/20';

  const riskBorderColor = 
    prediction.risk_level === 'High' ? 'border-red-500/30' :
    prediction.risk_level === 'Medium' ? 'border-amber-500/30' : 'border-emerald-500/30';

  // Highlight keywords in text
  const highlightText = (text, keywords) => {
    if (!text || !keywords || keywords.length === 0) return text;
    
    // Sort keywords by length desc so longer phrases match first
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
    const regex = new RegExp(`(${sortedKeywords.join('|')})`, 'gi');
    
    return text.split(regex).map((part, i) => {
      if (sortedKeywords.some(k => k.toLowerCase() === part.toLowerCase())) {
        return <mark key={i} className="bg-red-500/20 text-red-400 font-bold px-1 rounded">{part}</mark>;
      }
      return part;
    });
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate('/')} 
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Scanner
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="text-emerald-500" />
            Analysis Dashboard
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">Scan ID: {prediction.id.toString().padStart(8, '0')}</p>
          <p className="text-xs text-slate-500 font-mono">Model: EMCAD-RF-v1.4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Metrics & Risk */}
        <div className="space-y-6">
          <div className={`bg-slate-900 border ${riskBorderColor} rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden`}>
            {/* Ambient background glow based on risk */}
            <div className={`absolute inset-0 ${riskBgPulse} blur-3xl rounded-full opacity-30`}></div>
            
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Threat Assessment</h2>
            
            <div className="relative w-48 h-48 flex items-center justify-center mb-4 z-10">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" stroke="#1e293b" strokeWidth="8" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" stroke="currentColor" strokeWidth="8"
                  strokeDasharray={`${prediction.risk_score * 2.827} 282.7`}
                  className={riskColor}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold tracking-tighter ${riskColor}`}>
                  {prediction.risk_score.toFixed(1)}<span className="text-2xl opacity-50">%</span>
                </span>
                <span className="text-sm font-medium text-slate-400 mt-1 uppercase">Risk Score</span>
              </div>
            </div>
            
            <div className={`px-6 py-2 rounded-full border border-opacity-30 backdrop-blur-sm z-10 flex items-center gap-2 ${riskBorderColor} ${prediction.risk_level === 'High' ? 'bg-red-500/10 text-red-500' : prediction.risk_level === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {prediction.risk_level === 'High' ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
              <span className="font-bold tracking-wide">{prediction.risk_level.toUpperCase()} RISK</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Brain size={16} /> Semantic Extraction
            </h3>
            
            {prediction.red_flags && prediction.red_flags.length > 0 ? (
              <ul className="space-y-3">
                {prediction.red_flags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-300">Flagged Phrase: <span className="text-red-400">"{flag}"</span></p>
                      <p className="text-xs text-slate-500 mt-1">Found in unstructured text, high correlation with historical fraud.</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-950 border border-emerald-500/20 text-emerald-500">
                <Shield size={20} />
                <span className="text-sm font-medium">No distinct high-risk semantic markers detected.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Listing Data Display */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="text-emerald-500" /> Parsed Context
              </h3>
              <div className="text-xs font-mono bg-slate-800 px-3 py-1 rounded text-slate-400 flex items-center gap-2">
                <Server size={12} /> DB PERSISTED
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Company</p>
                <p className="text-slate-200 font-medium">{listing.company}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Title</p>
                <p className="text-slate-200 font-medium">{listing.title}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Location</p>
                <p className="text-slate-200 font-medium">{listing.location || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Description Segment</p>
                <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs leading-relaxed text-slate-300 max-h-60 overflow-y-auto border border-slate-800 shadow-inner whitespace-pre-wrap">
                  {highlightText(listing.description, prediction.red_flags)}
                </div>
              </div>
              
              {listing.requirements && (
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Requirements Segment</p>
                  <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs leading-relaxed text-slate-300 max-h-40 overflow-y-auto border border-slate-800 shadow-inner whitespace-pre-wrap">
                    {highlightText(listing.requirements, prediction.red_flags)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
