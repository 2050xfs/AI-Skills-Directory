import React, { useState } from 'react';
import { AgentLog, Division, AgentProfile } from '../types';
import { ORG_CHART } from '../constants';
import { Shield, Activity, GitPullRequest, Search, FileCode, Network, Cpu, Zap, List } from 'lucide-react';
import { auditCodeSnippet } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminConsoleProps {
  logs: AgentLog[];
}

const AdminConsole: React.FC<AdminConsoleProps> = ({ logs }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'stream' | 'sentinel-test'>('architecture');
  const [testCode, setTestCode] = useState('');
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 border-red-900/50 bg-red-900/20';
      case 'high': return 'text-orange-400 border-orange-900/50 bg-orange-900/20';
      case 'medium': return 'text-yellow-400 border-yellow-900/50 bg-yellow-900/20';
      default: return 'text-blue-400 border-blue-900/50 bg-blue-900/20';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-500 text-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
      case 'processing': return 'bg-blue-500 text-blue-100 animate-pulse';
      case 'learning': return 'bg-purple-500 text-purple-100';
      case 'idle': return 'bg-slate-700 text-slate-400';
      default: return 'bg-slate-700';
    }
  };

  const getDivisionColor = (color: string) => {
    const colors: Record<string, string> = {
      amber: 'border-amber-500/20 bg-amber-500/5 text-amber-500',
      red: 'border-red-500/20 bg-red-500/5 text-red-500',
      cyan: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-500',
      violet: 'border-violet-500/20 bg-violet-500/5 text-violet-500',
      pink: 'border-pink-500/20 bg-pink-500/5 text-pink-500',
      emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500',
      slate: 'border-slate-500/20 bg-slate-500/5 text-slate-500',
    };
    return colors[color] || colors.slate;
  };

  const handleManualAudit = async () => {
    if (!testCode) return;
    setIsAuditing(true);
    setAuditResult(null);
    try {
        const result = await auditCodeSnippet(testCode);
        setAuditResult(JSON.parse(result));
    } catch (e) {
        setAuditResult({ error: "Failed to parse audit response" });
    } finally {
        setIsAuditing(false);
    }
  };

  const chartData = [
    { name: 'Sentinel', value: 45, color: '#ef4444' }, // Red
    { name: 'Janitor', value: 30, color: '#06b6d4' }, // Cyan
    { name: 'Curator', value: 85, color: '#8b5cf6' }, // Violet
    { name: 'Herald', value: 62, color: '#ec4899' }, // Pink
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Cognition Stream</h2>
          <p className="text-slate-400 mt-1">Meta-Operations & Governance Division</p>
        </div>
        <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button 
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'architecture' ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Network className="w-4 h-4" /> Neural Architecture
            </button>
            <button 
                onClick={() => setActiveTab('stream')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'stream' ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <List className="w-4 h-4" /> Live Logs
            </button>
            <button 
                onClick={() => setActiveTab('sentinel-test')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'sentinel-test' ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Shield className="w-4 h-4" /> Manual Audit
            </button>
        </div>
      </div>

      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Org Chart Column */}
          <div className="lg:col-span-2 overflow-y-auto pr-2 space-y-8">
            {ORG_CHART.map((division) => (
              <div key={division.id} className="relative">
                {/* Division Header */}
                <div className={`flex items-center gap-3 mb-4 pl-4 border-l-2 ${getDivisionColor(division.color)}`}>
                  <h3 className="text-lg font-bold text-slate-200 uppercase tracking-widest">{division.name}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {division.departments.map((dept) => (
                    <div key={dept.id} className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 hover:bg-slate-900 transition-colors">
                      <h4 className="text-xs font-mono font-semibold text-slate-500 uppercase mb-4">{dept.name} Department</h4>
                      
                      <div className="space-y-3">
                        {dept.agents.map((agent) => (
                          <div 
                            key={agent.id}
                            onClick={() => setSelectedAgent(agent)}
                            className={`
                              group cursor-pointer p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-blue-500/50 transition-all
                              ${selectedAgent?.id === agent.id ? 'ring-1 ring-blue-500 border-blue-500' : ''}
                            `}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getAgentStatusColor(agent.status)}`}></div>
                                <span className="font-bold text-sm text-slate-200 group-hover:text-blue-400 transition-colors">{agent.name}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500">{agent.id}</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-2 line-clamp-1">{agent.role}</p>
                            <div className="flex flex-wrap gap-1">
                                {agent.tasks.slice(0, 2).map((task, i) => (
                                    <span key={i} className="text-[9px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800">{task}</span>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Inspector Column */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit sticky top-0">
            {selectedAgent ? (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
                  <div className="w-16 h-16 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 shadow-inner">
                    <Cpu className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedAgent.name}</h2>
                    <p className="text-sm text-blue-400 font-mono">{selectedAgent.role}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <h4 className="text-xs font-mono text-slate-500 mb-2 uppercase">Core Purpose</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{selectedAgent.purpose}</p>
                  </div>

                  <div>
                     <h4 className="text-xs font-mono text-slate-500 mb-2 uppercase flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Live Mandate
                     </h4>
                     <div className="flex items-center gap-2 mb-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getAgentStatusColor(selectedAgent.status)}`}>
                            {selectedAgent.status}
                        </span>
                        <span className="text-xs text-slate-500">Last heartbeat: 0.4s ago</span>
                     </div>
                  </div>

                  <div>
                     <h4 className="text-xs font-mono text-slate-500 mb-2 uppercase">Daily Routines</h4>
                     <ul className="space-y-2">
                        {selectedAgent.tasks.map((task, i) => (
                            <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                <span className="text-slate-600 mt-1">›</span> {task}
                            </li>
                        ))}
                     </ul>
                  </div>

                  <div>
                     <h4 className="text-xs font-mono text-slate-500 mb-2 uppercase">Decision Rights</h4>
                     <div className="flex flex-wrap gap-2">
                        {selectedAgent.decisions.map((d, i) => (
                            <span key={i} className="text-xs border border-blue-900/50 bg-blue-900/10 text-blue-300 px-2 py-1 rounded">
                                {d}
                            </span>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center p-8">
                <Network className="w-16 h-16 mb-4 opacity-20" />
                <p>Select a node in the neural architecture to inspect its cognitive profile.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'stream' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Panel */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Agent Activity Volume (24h)
                </h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center gap-4">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-full text-blue-400"><GitPullRequest className="w-5 h-5"/></div>
                    <div>
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-xs text-slate-500">Auto-Fix PRs Open</div>
                    </div>
                </div>
                 <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
                    <div className="bg-red-500/20 p-2 rounded-full text-red-400"><Shield className="w-5 h-5"/></div>
                    <div>
                        <div className="text-2xl font-bold text-white">3</div>
                        <div className="text-xs text-slate-500">Skills Quarantined</div>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="col-span-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                    <h3 className="font-semibold text-slate-200">Event Log</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-500 font-mono text-xs uppercase">
                        <tr>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">Agent</th>
                        <th className="px-6 py-3">Event</th>
                        <th className="px-6 py-3">Details</th>
                        <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                            <td className="px-6 py-4 font-medium text-slate-200">{log.agentId}</td>
                            <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase ${getSeverityColor(log.severity)}`}>
                                {log.eventType.replace('_', ' ')}
                            </span>
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate" title={log.observation}>{log.observation}</td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-300">{log.actionTaken}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
          </div>
      )}

      {activeTab === 'sentinel-test' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-blue-500" />
                      Paste Source Code
                  </h3>
                  <textarea 
                    className="w-full h-96 bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                    placeholder="import os&#10;def main():&#10;  os.system('rm -rf /')"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                  />
                  <button 
                    onClick={handleManualAudit}
                    disabled={isAuditing || !testCode}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                      {isAuditing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Analyzing via Gemini 1.5 Pro...
                          </>
                      ) : (
                          <>Run Sentinel Scan</>
                      )}
                  </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      Audit Report
                  </h3>
                  {auditResult ? (
                      <div className="space-y-4 animate-fade-in">
                          <div className="flex items-center gap-4">
                              <div className="text-sm text-slate-400">Risk Score</div>
                              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${auditResult.riskScore > 50 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                    style={{width: `${auditResult.riskScore}%`}}
                                  ></div>
                              </div>
                              <div className="font-mono font-bold text-white">{auditResult.riskScore}/100</div>
                          </div>
                          
                          <div className="p-4 bg-slate-950 rounded border border-slate-800">
                              <div className="text-xs font-mono text-slate-500 mb-2">STATUS</div>
                              <div className={`text-lg font-bold ${auditResult.status === 'APPROVED' ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {auditResult.status || 'UNKNOWN'}
                              </div>
                          </div>

                          <div>
                              <div className="text-xs font-mono text-slate-500 mb-2">FINDINGS</div>
                              <ul className="space-y-2">
                                  {auditResult.findings?.map((f: string, i: number) => (
                                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                          <span className="text-red-500 mt-1">•</span>
                                          {f}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                          Run a scan to see the Permission Profile.
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminConsole;
