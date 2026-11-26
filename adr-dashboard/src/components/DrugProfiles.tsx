import React, { useState } from 'react';
import type { Case } from '../types';
import { computeCausality } from '../utils/causality';
import { SeriousnessBadge, CausalityBadge } from './Badges';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Props { data: Case[]; onCaseClick: (c: Case) => void }

export const DrugProfiles: React.FC<Props> = ({ data, onCaseClick }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const drugs = [...new Set(data.map(r => r.SuspectProduct))].sort();

  const profileOf = (drug: string) => {
    const cases = data.filter(r => r.SuspectProduct === drug);
    const avgOnset = (cases.reduce((s, r) => s + r.OnsetDays, 0) / cases.length).toFixed(1);
    const reactions = [...new Set(cases.map(r => r.Reaction))];
    const serious = cases.filter(r => r.Seriousness !== 'Not serious').length;
    const unexpected = cases.filter(r => r.ExpectednessReference === 'Unexpected').length;
    const posRech = cases.filter(r => r.Rechallenge === 'Positive').length;
    return { cases, avgOnset, reactions, serious, unexpected, posRech };
  };

  const DRUG_COLORS: Record<string, string> = {
    Amoxicillin: '#3b82f6', Atorvastatin: '#8b5cf6', Metformin: '#10b981',
    Amlodipine: '#f59e0b', Ciprofloxacin: '#ef4444', Sertraline: '#ec4899',
    Omeprazole: '#06b6d4', Losartan: '#f97316',
  };

  return (
    <div className="space-y-4">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
        {drugs.map(drug => {
          const p = profileOf(drug);
          const color = DRUG_COLORS[drug] || '#3b82f6';
          const isOpen = selected === drug;
          return (
            <motion.div key={drug}
              className="card cursor-pointer overflow-hidden"
              onClick={() => setSelected(isOpen ? null : drug)}
              whileHover={{ y: -3, boxShadow: `0 8px 30px ${color}25` }}
              style={{ borderColor: isOpen ? color : '#30363d', transition: 'border-color .2s' }}
            >
              <div className="p-4" style={{ borderLeft: `3px solid ${color}` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-extrabold text-sm" style={{ color }}>{drug}</div>
                  <ChevronDown size={14} style={{ color: '#8b949e', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </div>
                <div className="text-xs mb-3" style={{ color: '#8b949e' }}>{p.reactions.join(', ')}</div>
                <div className="space-y-1.5">
                  {[
                    ['Cases', p.cases.length, color],
                    ['Avg Onset', `${p.avgOnset}d`, '#f59e0b'],
                    ['Serious', `${p.serious}/${p.cases.length}`, '#ef4444'],
                    ['Unexpected', p.unexpected, '#8b5cf6'],
                    ['+Rechallenge', p.posRech, '#10b981'],
                  ].map(([label, val, c]) => (
                    <div key={String(label)} className="flex justify-between text-xs" style={{ borderTop: '1px solid #30363d', paddingTop: '5px' }}>
                      <span style={{ color: '#8b949e' }}>{label}</span>
                      <strong style={{ color: c as string }}>{val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="p-3" style={{ borderTop: '1px solid #30363d', background: '#0d1117' }}>
                      <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8b949e' }}>Cases</div>
                      {p.cases.map(c => {
                        const caus = computeCausality(c);
                        return (
                          <div key={c.CaseID}
                            className="flex items-center justify-between text-xs py-1.5 cursor-pointer rounded px-1 transition-colors"
                            style={{ borderBottom: '1px solid rgba(48,54,61,.4)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,.06)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            onClick={e => { e.stopPropagation(); onCaseClick(c); }}
                          >
                            <span style={{ color: '#3b82f6', fontWeight: 700 }}>{c.CaseID}</span>
                            <span style={{ color: '#8b949e' }}>{c.Reaction} · {c.OnsetDays}d</span>
                            <CausalityBadge result={caus} />
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
