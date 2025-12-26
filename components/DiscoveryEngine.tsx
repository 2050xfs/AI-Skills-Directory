import React, { useState } from 'react';
import { Search, Sparkles, Server, Terminal, Globe, ShieldCheck, AlertTriangle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skill } from '../types';
import { matchSkillsWithIntent } from '../services/geminiService';

interface DiscoveryEngineProps {
  skills: Skill[];
}

const DiscoveryEngine: React.FC<DiscoveryEngineProps> = ({ skills }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>(skills);
  const [activeTab, setActiveTab] = useState<'all' | 'finance' | 'design' | 'productivity'>('all');

  // Debounced search effect or manual trigger
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setFilteredSkills(skills);
      return;
    }

    setIsSearching(true);
    try {
      // 1. Get relevant skill names from Gemini
      // Prepare simplified skill list for the prompt to save tokens
      const skillSummary = skills.map(s => JSON.stringify({ name: s.name, outcomes: s.outcomes }));
      const matchedJson = await matchSkillsWithIntent(query, skillSummary);
      const matchedNames: string[] = JSON.parse(matchedJson);

      // 2. Filter local list based on matches
      if (matchedNames.length > 0) {
        const results = skills.filter(s => matchedNames.includes(s.name));
        // Fallback: also include fuzzy text match if AI misses something
        const fallback = skills.filter(s => 
           !matchedNames.includes(s.name) && 
           (s.name.toLowerCase().includes(query.toLowerCase()) || 
            s.description.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredSkills([...results, ...fallback]);
      } else {
        // Fallback to basic search if AI returns empty
         const results = skills.filter(s => 
           s.name.toLowerCase().includes(query.toLowerCase()) || 
           s.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSkills(results);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Skills' },
    { id: 'finance', label: 'Finance' },
    { id: 'design', label: 'Design' },
    { id: 'productivity', label: 'Productivity' },
  ];

  const getCompatibilityIcon = (type: string) => {
    switch (type) {
      case 'Local': return <Terminal className="w-3 h-3" />;
      case 'Hosted': return <Server className="w-3 h-3" />;
      case 'Edge': return <Globe className="w-3 h-3" />;
      default: return <Globe className="w-3 h-3" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Quarantined') {
        return <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded"><AlertTriangle className="w-3 h-3"/> QUARANTINED</span>
    }
    return <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded"><ShieldCheck className="w-3 h-3"/> VERIFIED</span>
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Marketplace</h2>
          <p className="text-slate-400 mt-1">Discover specialized AI agents for your enterprise jobs.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-800/50">
           <Sparkles className="w-4 h-4 text-blue-400" />
           <span className="text-xs text-blue-300 font-mono">Curator Agent Active</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <form onSubmit={handleSearch}>
            <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 bg-slate-900 border border-slate-800 rounded-xl leading-5 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm text-slate-200 shadow-xl transition-all"
            placeholder="Describe your job to be done (e.g., 'Help me analyze SEC filings')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
        </form>
        {isSearching && (
          <div className="absolute right-3 top-4">
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id as any)}
            className={`
              px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap
              ${activeTab === cat.id 
                ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-900/30' 
                : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
                <p>No skills found matching your criteria.</p>
            </div>
        ) : (
            filteredSkills
            .filter(s => activeTab === 'all' || s.category.toLowerCase() === activeTab)
            .map(skill => (
            <div 
                key={skill.id}
                className={`
                    group relative bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden flex flex-col
                    ${skill.status === 'Quarantined' ? 'opacity-70 grayscale-[0.5]' : ''}
                `}
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-300">
                        {skill.name.substring(0, 2).toUpperCase()}
                    </div>
                </div>
                {getStatusBadge(skill.status)}
                </div>

                <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">{skill.name}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">{skill.description}</p>

                {/* Outcomes */}
                <div className="space-y-2 mb-6 flex-1">
                {skill.outcomes.slice(0, 2).map((outcome, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    {outcome}
                    </div>
                ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                        {getCompatibilityIcon(skill.compatibility)}
                        {skill.compatibility}
                        </span>
                        <span>{skill.provider}</span>
                    </div>
                    
                    <div className="flex gap-2">
                         <Link 
                            to={`/blog/${skill.id}`}
                            className="text-xs font-medium text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded transition-colors border border-blue-900/50 hover:bg-blue-900/20 flex items-center gap-1"
                         >
                            <BookOpen className="w-3 h-3" />
                            Analysis
                         </Link>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default DiscoveryEngine;
