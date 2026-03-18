import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, ShieldCheck, Activity, Brain } from 'lucide-react';
import { api } from '../api';

export default function AnalyticsDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Activity className="h-12 w-12 animate-spin mb-4 text-emerald-500" />
        <p>Loading Analytics Engine...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center mt-20 text-slate-400">
        <ShieldCheck size={48} className="mx-auto mb-4 text-slate-600" />
        <h2 className="text-xl font-semibold text-white mb-2">No Data Available</h2>
        <p>Run some scans on the Check page to generate analytics.</p>
      </div>
    );
  }

  // --- Data Aggregation ---
  
  // 1. Risk Level Distribution
  const riskCounts = { High: 0, Medium: 0, Low: 0 };
  let totalRiskScore = 0;
  
  // 2. Trend over time (simplified by scan index for MVP)
  const trendData = [...history].reverse().map((item, idx) => ({
    name: `Scan ${idx + 1}`,
    score: item.prediction?.risk_score || 0
  }));

  // 3. Flag Frequency
  const flagFrequency = {};

  history.forEach(item => {
    const pred = item.prediction;
    if (!pred) return;
    
    // Risk counts
    if (riskCounts[pred.risk_level] !== undefined) {
      riskCounts[pred.risk_level]++;
    }
    
    // Total score
    totalRiskScore += pred.risk_score;

    // Flags
    if (pred.red_flags && Array.isArray(pred.red_flags)) {
      pred.red_flags.forEach(flag => {
        flagFrequency[flag] = (flagFrequency[flag] || 0) + 1;
      });
    }
  });

  const avgRisk = history.length > 0 ? (totalRiskScore / history.length).toFixed(1) : 0;

  const riskPieData = [
    { name: 'High Risk', value: riskCounts.High, color: '#ef4444' },     // red-500
    { name: 'Medium Risk', value: riskCounts.Medium, color: '#f59e0b' }, // amber-500
    { name: 'Low Risk', value: riskCounts.Low, color: '#10b981' },       // emerald-500
  ].filter(d => d.value > 0);

  const topFlagsData = Object.entries(flagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <TrendingUp className="text-emerald-500" />
          Analytics & Insights
        </h1>
        <p className="text-slate-400">Macro trends and aggregated data from the fraud detection model.</p>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full opacity-50"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Total Scans</p>
              <h3 className="text-4xl font-bold text-white">{history.length}</h3>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-emerald-500">
              <Activity size={24} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 blur-2xl rounded-full opacity-50"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Average Risk</p>
              <h3 className="text-4xl font-bold text-white">{avgRisk}<span className="text-xl text-slate-500 ml-1">%</span></h3>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-amber-500">
              <Brain size={24} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5 blur-2xl rounded-full opacity-50"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">High Risk Detected</p>
              <h3 className="text-4xl font-bold text-white">{riskCounts.High}</h3>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-red-500">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Trend Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">Risk Score Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">Risk Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Flags Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">Top Red Flags Extracted</h3>
          <div className="h-72">
            {topFlagsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFlagsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={120} />
                  <Tooltip 
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                    {topFlagsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                <p>No high-risk keywords detected in history yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
