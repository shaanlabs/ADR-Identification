import React, { useState } from 'react';
import type { Case } from '../types';
import { computeCausality } from '../utils/causality';
import { DcBadge, CausalityBadge, ExpectBadge } from './Badges';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

interface WhoScores { time: number | null; known: number | null; dech: number | null; rech: number | null; alt: number | null; obj: number | null }

const QUESTIONS: Array<{ key: keyof WhoScores; label: string; opts: Array<{ label: string; score: number }> }> = [
  { key: 'time', label: '1. Time relationship between drug and event?',
    opts: [{ label: 'Yes, plausible ✔', score: 3 }, { label: 'Possible ⚠', score: 1 }, { label: 'No / Unknown ✘', score: 0 }] },
  { key: 'known', label: '2. Reaction known for this drug?',
    opts: [{ label: 'Yes (labelled) ✔', score: 2 }, { label: 'Possible (literature) ⚠', score: 1 }, { label: 'No / Unknown ✘', score: 0 }] },
  { key: 'dech', label: '3. Improvement on drug withdrawal (Dechallenge)?',
    opts: [{ label: 'Yes ✔', score: 2 }, { label: 'Partial ⚠', score: 1 }, { label: 'No / N/A', score: -1 }, { label: 'Unknown', score: 0 }] },
  { key: 'rech', label: '4. Recurrence on re-exposure (Rechallenge)?',
    opts: [{ label: 'Yes ✔', score: 3 }, { label: 'No / Not done', score: 0 }, { label: 'N/A', score: -1 }] },
  { key: 'alt', label: '5. Alternative causes reasonably excluded?',
    opts: [{ label: 'Yes ✔', score: 2 }, { label: 'No / Unlikely', score: 0 }, { label: 'Partly ⚠', score: 1 }] },
  { key: 'obj', label: '6. Reaction confirmed by objective evidence?',
    opts: [{ label: 'Yes ✔', score: 1 }, { label: 'No / Unknown', score: 0 }] },
];

interface Props { data: Case[] }

export const CausalityAssessor: React.FC<Props> = ({ data }) => {
  const [scores, setScores] = useState<WhoScores>({ time: null, known: null, dech: null, rech: null, alt: null, obj: null });
  const [result, setResult] = useState<{ cat: string; color: string; desc: string; score: number } | null>(null);

  const calc = () => {
    if (Object.values(scores).includes(null)) { alert('Please answer all 6 questions.'); return; }
    const total = Object.values(scores).reduce<number>((s, v) => s + (v ?? 0), 0);
    let cat: string, color: string, desc: string;
    if (total >= 10) { cat = 'Certain'; color = '#10b981'; desc = 'Event conclusively attributed to the drug.'; }
    else if (total >= 7) { cat = 'Probable'; color = '#3b82f6'; desc = 'Reasonable time sequence; no confounding; positive dechallenge.'; }
    else if (total >= 4) { cat = 'Possible'; color = '#f59e0b'; desc = 'Reasonable time sequence; could also be explained by other causes.'; }
    else if (total >= 2) { cat = 'Unlikely'; color = '#ef4444'; desc = 'Doubtful time sequence; other causes more likely.'; }
    else { cat = 'Conditional/Unassessable'; color = '#6b7280'; desc = 'Insufficient data or contradictory information.'; }
    setResult({ cat, color, desc, score: total });
  };

  const reset = () => { setScores({ time: null, known: null, dech: null, rech: null, alt: null, obj: null }); setResult(null); };

  return (
    <div className="space-y-5">
      {/* Interactive tool */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={16} style={{ color: '#3b82f6' }} />
          <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8b949e' }}>WHO-UMC Causality Assessment Tool</h3>
        </div>
        <p className="text-xs mb-5" style={{ color: '#8b949e' }}>
          Answer all 6 questions based on your case details to generate a WHO-UMC causality category.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
          {QUESTIONS.map(q => (
            <div key={q.key} className="p-4 rounded-xl" style={{ background: '#0d1117' }}>
              <label className="block text-xs font-semibold mb-3" style={{ color: '#e6edf3' }}>{q.label}</label>
              <div className="flex flex-wrap gap-2">
                {q.opts.map(opt => {
                  const sel = scores[q.key] === opt.score;
                  return (
                    <button key={opt.label}
                      onClick={() => setScores(prev => ({ ...prev, [q.key]: opt.score }))}
                      className="btn text-xs"
                      style={{
                        padding: '5px 10px',
                        background: sel ? 'rgba(59,130,246,.15)' : 'transparent',
                        border: `1px solid ${sel ? '#3b82f6' : '#30363d'}`,
                        color: sel ? '#3b82f6' : '#8b949e',
                      }}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button className="btn btn-primary" onClick={calc}>Calculate Causality →</button>
          <button className="btn btn-outline" onClick={reset}>Reset</button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl flex flex-wrap items-center gap-4"
            style={{ background: `${result.color}10`, border: `1px solid ${result.color}30` }}>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>WHO-UMC Category</div>
              <div className="text-2xl font-black" style={{ color: result.color }}>{result.cat}</div>
            </div>
            <div className="flex-1 text-sm" style={{ color: '#8b949e' }}>{result.desc}</div>
            <div className="text-sm font-bold px-4 py-2 rounded-lg" style={{ background: '#0d1117' }}>
              Score: <span style={{ color: result.color }}>{result.score}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Pre-computed table */}
      <div className="card p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8b949e' }}>
          Pre-computed Causality — All 18 Cases
        </h3>
        <div style={{ overflow: 'auto', maxHeight: '400px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead style={{ position: 'sticky', top: 0 }}>
              <tr>
                {['Case ID','Drug','Reaction','Dechallenge','Rechallenge','Expectedness','Causality','Rationale'].map(h => (
                  <th key={h} style={{ background: '#1c2230', padding: '10px 14px', fontSize: '11px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '.5px', color: '#8b949e', borderBottom: '1px solid #30363d', textAlign: 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => {
                const c = computeCausality(r);
                return (
                  <motion.tr key={r.CaseID} className="table-row-hover"
                    style={{ borderBottom: '1px solid rgba(48,54,61,.4)' }}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <td style={{ padding: '8px 14px', fontSize: '12px', color: '#3b82f6', fontWeight: 700 }}>{r.CaseID}</td>
                    <td style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 600 }}>{r.SuspectProduct}</td>
                    <td style={{ padding: '8px 14px', fontSize: '12px' }}>{r.Reaction}</td>
                    <td style={{ padding: '8px 14px' }}><DcBadge value={r.Dechallenge} /></td>
                    <td style={{ padding: '8px 14px' }}><DcBadge value={r.Rechallenge} /></td>
                    <td style={{ padding: '8px 14px' }}><ExpectBadge value={r.ExpectednessReference} /></td>
                    <td style={{ padding: '8px 14px' }}><CausalityBadge result={c} /></td>
                    <td style={{ padding: '8px 14px', fontSize: '11px', color: '#8b949e' }}>{c.rationale.join(' · ')}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
