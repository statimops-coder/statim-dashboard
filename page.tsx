"use client";

import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Cpu, 
  RefreshCw, 
  FileText, 
  Circle, 
  Zap, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

// Types for our dashboard data
interface DashboardData {
  pulse: {
    last_heartbeat: string;
    status: string;
  };
  token_usage: {
    daily_limit: number;
    current_usage: number;
    percentage: number;
  };
  active_state: {
    notion_sync: string;
    is_active: boolean;
  };
  journal: string[];
  updated_at: string;
}

const GlassCard = ({ children, title, icon: Icon, className = "" }: any) => (
  <div className={`bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
        {Icon && <Icon size={16} className="text-blue-500" />}
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export default function StatimDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from /api/dashboard
    // For this draft, we'll imagine it's loaded
    fetch('/public_dashboard.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center font-sans">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-8 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">Statim</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">System Overview</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 font-medium">LATEST UPDATE</p>
            <p className="font-semibold text-gray-600">{new Date(data.updated_at).toLocaleTimeString()}</p>
          </div>
        </header>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Pulse Card */}
          <GlassCard title="Pulse" icon={Activity}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-2xl font-bold">Active</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Last heartbeat: {new Date(data.pulse.last_heartbeat).toLocaleTimeString()}
            </p>
          </GlassCard>

          {/* Token Usage Card */}
          <GlassCard title="Token Usage" icon={Cpu}>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold">{(data.token_usage.current_usage / 1000).toFixed(0)}k</span>
              <span className="text-xs font-bold text-gray-400">/ 1M limit</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${data.token_usage.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">{data.token_usage.percentage}% of daily quota used</p>
          </GlassCard>

          {/* Sync Status Card */}
          <GlassCard title="Notion Sync" icon={RefreshCw}>
            <div className="flex items-center gap-3">
              <Zap className="text-amber-500" size={24} fill="currentColor" />
              <span className="text-2xl font-bold">Synced</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Last sync: {new Date(data.active_state.notion_sync).toLocaleTimeString()}
            </p>
          </GlassCard>
        </div>

        {/* Journal Feed */}
        <div className="grid grid-cols-1 gap-6">
          <GlassCard title="Recent Memory Logs" icon={FileText}>
            <div className="space-y-4">
              {data.journal.map((entry, i) => (
                <div key={i} className="group flex items-start gap-4 p-3 hover:bg-white/50 rounded-2xl transition-colors cursor-default">
                  <div className="mt-1">
                    <Circle size={8} className="text-blue-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      {entry}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
        
        <footer className="mt-12 text-center">
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
            Statim Intelligence System • Encrypted & Secure
          </p>
        </footer>
      </div>
    </div>
  );
}
