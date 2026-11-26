import React, { useState } from 'react';
import type { Case, TabId } from './types';
import { CASES } from './data/cases';
import { CaseTable } from './components/CaseTable';
import { Analytics } from './components/Analytics';
import { DrugProfiles } from './components/DrugProfiles';
import { CausalityAssessor } from './components/CausalityAssessor';
import { FieldGuide } from './components/FieldGuide';
import { SummaryReport } from './components/SummaryReport';
import { CaseModal } from './components/CaseModal';
import { exportCSV } from './utils/causality';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill, BarChart3, FlaskConical, BookOpen, FileText,
  Stethoscope, Download, Printer, ExternalLink,
  AlertTriangle, Hospital, Zap, RefreshCw
} from 'lucide-react';

const TABS: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  { id: 'cases',      label: 'Case Table',          icon: <Stethoscope size={14} /> },
  { id: 'analytics',  label: 'Analytics',            icon: <BarChart3 size={14} /> },
  { id: 'drugs',      label: 'Drug Profiles',        icon: <Pill size={14} /> },
  { id: 'causality',  label: 'Causality Assessor',  icon: <FlaskConical size={14} /> },
  { id: 'fieldguide', label: 'Field Guide',          icon: <BookOpen size={14} /> },
  { id: 'report',     label: 'ADR Report',           icon: <FileText size={14} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('cases');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const stats = [
    { label: 'Total Cases', value: CASES.length, icon: <FileText size={18} />, color: '#3b82f6', sub: 'Synthetic PV cases' },
    { label: 'Serious Events', value: CASES.filter(r => r.Seriousness !== 'Not serious').length, icon: <AlertTriangle size={18} />, color: '#ef4444', sub: `${((CASES.filter(r => r.Seriousness !== 'Not serious').length / CASES.length) * 100).toFixed(0)}% of total` },
    { label: 'Hospitalisations', value: CASES.filter(r => r.Seriousness === 'Hospitalisation').length, icon: <Hospital size={18} />, color: '#f59e0b', sub: 'Highest severity tier' },
    { label: 'Unexpected ADRs', value: CASES.filter(r => r.ExpectednessReference === 'Unexpected').length, icon: <Zap size={18} />, color: '#8b5cf6', sub: 'Unlabelled reactions' },
    { label: '+Rechallenges', value: CASES.filter(r => r.Rechallenge === 'Positive').length, icon: <RefreshCw size={18} />, color: '#10b981', sub: 'Strong causality signal' },
    { label: 'Suspect Drugs', value: [...new Set(CASES.map(r => r.SuspectProduct))].length, icon: <Pill size={18} />, color: '#06b6d4', sub: 'Unique medications' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#1c2230', color: '#e6edf3', border: '1px solid #30363d', fontSize: '13px' },
      }} />

      {/* HEADER */}
      <header id="header" className="glass sticky top-0 z-40" style={{ borderBottom: '1px solid #30363d' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="flex items-center gap-4 py-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg animate-glow"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>💊</div>
              <div>
                <div className="font-extrabold text-base tracking-tight">
                  ADR<span style={{ color: '#3b82f6' }}>Insight</span>
                </div>
                <div className="text-xs font-medium" style={{ color: '#8b949e' }}>Pharmacovigilance Dashboard</div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.25)', color: '#3b82f6' }}>
              PV Task 1 · Educational Only
            </span>
            <div className="flex gap-2 ml-auto flex-wrap">
              <a href="https://youtu.be/CqoYIT_qoTM" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '12px' }}>
                <ExternalLink size={12} /> Tutorial
              </a>
              <button className="btn btn-outline" style={{ fontSize: '12px' }}
                onClick={() => { exportCSV(CASES); toast.success('CSV exported!'); }}>
                <Download size={12} /> Export CSV
              </button>
              <button className="btn btn-success" style={{ fontSize: '12px' }}
                onClick={() => { setActiveTab('report'); setTimeout(() => window.print(), 400); }}>
                <Printer size={12} /> Print Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem 4rem' }}>
        {/* Objective banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl mb-6 flex gap-3 items-start flex-wrap"
          style={{ background: 'linear-gradient(135deg,rgba(59,130,246,.08),rgba(139,92,246,.05))', border: '1px solid rgba(59,130,246,.2)' }}>
          <div className="text-2xl">🎯</div>
          <div className="flex-1">
            <div className="font-bold text-sm mb-1">Objective</div>
            <div className="text-xs leading-relaxed" style={{ color: '#8b949e' }}>
              Identify suspect drugs and correlate adverse event timelines using clinical intake records. Analyze 18 synthetic patient case
              scenarios to determine ADR causality using WHO-UMC criteria. Distinguish suspect vs co-medications using pharmacological criteria.
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <span className="badge" style={{ background:'rgba(16,185,129,.12)', color:'#10b981', border:'1px solid rgba(16,185,129,.3)' }}>📋 18 Cases Loaded</span>
            <span className="badge" style={{ background:'rgba(139,92,246,.12)', color:'#8b5cf6', border:'1px solid rgba(139,92,246,.3)' }}>🔬 WHO-UMC Engine</span>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(185px,1fr))', gap: '1rem' }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} className="card p-4 relative overflow-hidden"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3, boxShadow: `0 10px 30px ${s.color}20` }}>
              <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 80% 20%,${s.color},transparent 70%)` }} />
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8b949e' }}>{s.label}</div>
                <div style={{ color: s.color, opacity: .5 }}>{s.icon}</div>
              </div>
              <div className="text-3xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#6b7280' }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div id="tabs" className="flex gap-2 mb-5 flex-wrap">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="btn flex items-center gap-1.5"
              style={{
                fontSize: '12px', fontWeight: 600,
                background: activeTab === tab.id ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : '#161b22',
                border: `1px solid ${activeTab === tab.id ? 'transparent' : '#30363d'}`,
                color: activeTab === tab.id ? '#fff' : '#8b949e',
                boxShadow: activeTab === tab.id ? '0 4px 14px rgba(59,130,246,.3)' : 'none',
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}>
            {activeTab === 'cases' && <CaseTable data={CASES} onRowClick={setSelectedCase} />}
            {activeTab === 'analytics' && <Analytics data={CASES} />}
            {activeTab === 'drugs' && <DrugProfiles data={CASES} onCaseClick={(c) => { setSelectedCase(c); }} />}
            {activeTab === 'causality' && <CausalityAssessor data={CASES} />}
            {activeTab === 'fieldguide' && <FieldGuide />}
            {activeTab === 'report' && <SummaryReport data={CASES} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <CaseModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />

      <footer className="text-center py-5 text-xs" style={{ background: '#161b22', borderTop: '1px solid #30363d', color: '#8b949e' }}>
        <strong style={{ color: '#e6edf3' }}>ADRInsight</strong> · Workora Synthetic PV Training Pack · Task 1 ·{' '}
        <a href="https://youtu.be/CqoYIT_qoTM" target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>Tutorial</a> ·{' '}
        <span style={{ color: '#ef4444' }}>Educational use only</span>
      </footer>
    </div>
  );
}
