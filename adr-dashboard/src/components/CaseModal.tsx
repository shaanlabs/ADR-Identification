import React from 'react';
import type { Case } from '../types';
import { computeCausality } from '../utils/causality';
import { CausalityBadge, SeriousnessBadge, ExpectBadge, DcBadge } from './Badges';
import { X, Calendar, Pill, User, FileText, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  caseData: Case | null;
  onClose: () => void;
}

export const CaseModal: React.FC<Props> = ({ caseData, onClose }) => {
  if (!caseData) return null;
  const c = computeCausality(caseData);

  const onsetColor = caseData.OnsetDays <= 7 ? '#10b981' : caseData.OnsetDays <= 14 ? '#f59e0b' : '#ef4444';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(6px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b"
            style={{ background: 'linear-gradient(135deg,rgba(59,130,246,.12),rgba(139,92,246,.08))', borderColor: '#30363d' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>💊</div>
            <div>
              <h2 className="font-extrabold text-base" style={{ color: '#e6edf3' }}>{caseData.CaseID}</h2>
              <p className="text-xs" style={{ color: '#8b949e' }}>{caseData.SuspectProduct} · {caseData.Reporter}</p>
            </div>
            <button onClick={onClose} className="ml-auto p-1.5 rounded-lg transition-colors"
              style={{ color: '#8b949e' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e6edf3')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8b949e')}>
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Narrative */}
            <div className="p-4 rounded-xl text-sm italic"
              style={{ background: '#0d1117', borderLeft: '3px solid #3b82f6', color: '#8b949e', lineHeight: 1.7 }}>
              <FileText size={13} className="inline mr-1 mb-0.5" style={{ color: '#3b82f6' }} />
              {caseData.Narrative}
            </div>

            {/* Grid fields */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Patient', value: `${caseData.Age} yrs · ${caseData.Sex}`, icon: <User size={12} /> },
                { label: 'Suspect Drug', value: caseData.SuspectProduct, color: '#3b82f6', icon: <Pill size={12} /> },
                { label: 'Dose & Route', value: `${caseData.Dose} · ${caseData.Route}` },
                { label: 'Indication', value: caseData.Indication },
              ].map((f) => (
                <div key={f.label} className="p-3 rounded-xl" style={{ background: '#0d1117' }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>{f.label}</div>
                  <div className="font-semibold text-sm flex items-center gap-1" style={{ color: f.color || '#e6edf3' }}>
                    {f.icon}{f.value}
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-xl" style={{ background: '#0d1117' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>Adverse Reaction</div>
                <div className="font-semibold text-sm" style={{ color: '#ef4444' }}>⚠️ {caseData.Reaction}</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: '#0d1117' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>Onset</div>
                <div className="font-bold text-sm" style={{ color: onsetColor }}>{caseData.OnsetDays} days after treatment</div>
              </div>

              <div className="p-3 rounded-xl" style={{ background: '#0d1117' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>Expectedness</div>
                <ExpectBadge value={caseData.ExpectednessReference} />
              </div>
              <div className="p-3 rounded-xl" style={{ background: '#0d1117' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>Seriousness</div>
                <SeriousnessBadge value={caseData.Seriousness} />
              </div>

              <div className="p-3 rounded-xl" style={{ background: '#0d1117' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>Dechallenge</div>
                <DcBadge value={caseData.Dechallenge} />
              </div>
              <div className="p-3 rounded-xl" style={{ background: '#0d1117' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>Rechallenge</div>
                <DcBadge value={caseData.Rechallenge} />
              </div>

              <div className="p-3 rounded-xl" style={{ background: '#0d1117' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>Concomitant Meds</div>
                <div className="text-sm" style={{ color: '#e6edf3' }}>{caseData.ConcomitantMedicines}</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: '#0d1117' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>WHO-UMC Causality</div>
                <CausalityBadge result={c} />
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: '#8b949e' }}>
                <Calendar size={12} /> Event Timeline
              </div>
              <div className="relative pl-7">
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5" style={{ background: '#30363d' }} />
                {[
                  { dot: '#3b82f6', title: 'Day 0 — Drug Initiated', sub: `${caseData.SuspectProduct} ${caseData.Dose} started (${caseData.Indication})` },
                  { dot: '#f59e0b', title: `Day ${caseData.OnsetDays} — ADR Onset`, sub: `${caseData.Reaction} reported` },
                  { dot: '#ef4444', title: 'Post-onset — Drug Stopped', sub: `Dechallenge: ${caseData.Dechallenge} · Rechallenge: ${caseData.Rechallenge}` },
                ].map((tl, i) => (
                  <div key={i} className="relative mb-4 last:mb-0">
                    <div className="absolute -left-4 top-1 w-3 h-3 rounded-full border-2"
                      style={{ background: tl.dot, borderColor: '#161b22', boxShadow: `0 0 0 2px ${tl.dot}` }} />
                    <div className="text-sm font-bold" style={{ color: '#e6edf3' }}>{tl.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#8b949e' }}>{tl.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Causality Rationale */}
            <div className="p-4 rounded-xl" style={{ background: `${c.color}12`, border: `1px solid ${c.color}30` }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: c.color }}>
                <TrendingUp size={12} /> Causality Rationale
              </div>
              <div className="flex flex-wrap gap-2">
                {c.rationale.map((r, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${c.color}20`, color: c.color }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
