import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Search, Activity, Clock, BookOpen } from 'lucide-react';
import CheckPage from './components/Check';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './components/Analytics';
import HistoryTab from './components/History';
import Methodology from './components/Methodology';

function NavItem({ to, icon: Icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 
        ${isActive 
          ? 'bg-emerald-500/10 text-emerald-500 font-medium border border-emerald-500/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shadow-lg relative overflow-hidden">
        {/* Glowing top line effect */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 mr-8 group">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">JobCheck<span className="text-emerald-500">.ai</span></span>
              </Link>
              
              <nav className="hidden md:flex space-x-2">
                <NavItem to="/" icon={Search} label="Scan Job" />
                <NavItem to="/analytics" icon={Activity} label="Analytics" />
                <NavItem to="/history" icon={Clock} label="History" />
                <NavItem to="/methodology" icon={BookOpen} label="How it Works" />
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="absolute top-20 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-slate-800/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-0">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} JobCheck AI Platform. Cybersecurity Framework MVP.
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CheckPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/history" element={<HistoryTab />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
