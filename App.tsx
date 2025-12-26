import React, { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, ShieldAlert, Zap, Activity, Menu, X } from 'lucide-react';
import { MOCK_SKILLS, MOCK_LOGS } from './constants';
import DiscoveryEngine from './components/DiscoveryEngine';
import AdminConsole from './components/AdminConsole';
import BlogPost from './components/BlogPost';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: LayoutGrid, label: 'Registry' },
    { path: '/admin', icon: ShieldAlert, label: 'Cognition Stream' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 tracking-tight">Skill Smithy</h1>
          <p className="text-xs text-slate-400 font-mono">ENT-REGISTRY v3.1</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-blue-900/20 text-blue-400 border border-blue-800/50 shadow-sm' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'}
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">SYSTEM HEALTH</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>SENTINEL</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
            <span>WRITER-01</span>
            <span className="text-blue-400">ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-50 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-slate-100">Skill Smithy</span>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300">
                {isOpen ? <X /> : <Menu />}
            </button>
            
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-slate-950 border-b border-slate-800 p-4 flex flex-col gap-4 shadow-xl">
                    <NavLink to="/" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white">Registry</NavLink>
                    <NavLink to="/admin" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white">Cognition Stream</NavLink>
                </div>
            )}
        </div>
    )
}

const App = () => {
  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full">
          <MobileNav />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
              <Routes>
                <Route path="/" element={<DiscoveryEngine skills={MOCK_SKILLS} />} />
                <Route path="/blog/:skillId" element={<BlogPost skills={MOCK_SKILLS} />} />
                <Route path="/admin" element={<AdminConsole logs={MOCK_LOGS} />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
