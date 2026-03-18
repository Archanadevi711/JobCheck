import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader, Copy, Briefcase, Building, MapPin, AlignLeft, LayoutTemplate } from 'lucide-react';
import { api } from '../api';

export default function CheckPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('structured'); // 'structured' or 'raw'
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: ''
  });
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      let payload;
      if (mode === 'raw') {
        if (!rawText) {
          setError("Please paste a job description.");
          setLoading(false);
          return;
        }
        payload = {
          title: "Raw Input",
          company: "Unknown",
          description: rawText,
        };
      } else {
        if (!formData.title || !formData.description) {
          setError("Title and Description are required.");
          setLoading(false);
          return;
        }
        payload = formData;
      }

      const response = await api.scanListing(payload);
      navigate('/dashboard', { state: { scanResult: response } });
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the analysis engine. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasteDemo = () => {
    if (mode === 'raw') {
      setRawText("Company: Global Tech Solutions LLC\nTitle: Data Entry Clerk - Remote\n\nWe are looking for immediate hires for data entry roles. Work from home and earn unlimited earning potential! No experience necessary, we provide all training. Flexible hours. You must purchase a starter kit for £50 which will be reimbursed after 30 days.\n\nRequirements:\nMust have stable internet. Must be willing to use WhatsApp for all communications. Must have a valid bank account for direct wire transfer payments.");
    } else {
      setFormData({
        title: 'Data Entry Clerk - Remote',
        company: 'Global Tech Solutions LLC',
        location: 'Remote (Anywhere)',
        description: 'We are looking for immediate hires for data entry roles. Work from home and earn unlimited earning potential! No experience necessary, we provide all training. Flexible hours. You must purchase a starter kit for £50 which will be reimbursed after 30 days.',
        requirements: 'Must have stable internet. Must be willing to use WhatsApp for all communications. Must have a valid bank account for direct wire transfer payments.'
      });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Scan Job Listing</h1>
          <p className="text-slate-400">Run our Deep Learning fraud detection model on any job posting.</p>
        </div>
        
        {/* Mode Toggle */}
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex space-x-1">
          <button
            onClick={() => setMode('structured')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'structured' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <LayoutTemplate size={16} />
            Structured Form
          </button>
          <button
            onClick={() => setMode('raw')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'raw' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <AlignLeft size={16} />
            Raw Clipboard Paste
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleScan} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500/30 rounded-br-xl opacity-50"></div>

        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-lg font-semibold text-white">
            {mode === 'structured' ? 'Detailed Entry' : 'Quick Paste'}
          </h2>
          <button 
            type="button" 
            onClick={handlePasteDemo}
            className="text-xs flex items-center gap-1 text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20"
          >
            <Copy size={12} /> Paste Demo Data
          </button>
        </div>

        {mode === 'structured' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Briefcase size={14} className="text-slate-500" /> Job Title <span className="text-emerald-500">*</span>
                </label>
                <input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Building size={14} className="text-slate-500" /> Company Name
                </label>
                <input 
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <MapPin size={14} className="text-slate-500" /> Location
                </label>
                <input 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                  placeholder="e.g. Remote, San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  Job Description <span className="text-emerald-500">*</span>
                </label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm resize-y"
                  placeholder="Paste the full job description here..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Requirements / Qualifications (Optional)</label>
                <textarea 
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm resize-y"
                  placeholder="Paste requirements here if separated..."
                />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Raw Text <span className="text-emerald-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">Paste the entire job posting including title, company, description, and requirements. The model will analyze the entire block of text.</p>
            <textarea 
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={14}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm resize-y"
              placeholder="Dump unstructured text here (Ctrl+V)..."
            />
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-slate-800 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-8 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : <Search size={20} />}
            {loading ? 'Analyzing Neural Network...' : 'Initiate Scan'}
          </button>
        </div>
      </form>
    </div>
  );
}
