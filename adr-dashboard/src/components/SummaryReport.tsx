import React from 'react';
import type { Case } from '../types';
import { computeCausality, countBy, exportCSV } from '../utils/causality';
import { SeriousnessBadge, DcBadge, CausalityBadge } from './Badges';
import { Printer, Download } from 'lucide-react';

interface Props { data: Case[] }

export const SummaryReport: React.FC<Props> = ({ data }) => {
  const drugs = [...new Set(data.map(r => r.SuspectProduct))].sort();
  const causDist = data.reduce((acc, r) => {
    const c = computeCausality(r);
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const causMeta: Record<string, { color: string }> = {
    'Certain': { color: '#10b981' }, 'Probable': { color: '#3b82f6' },
    'Possible': { color: '#f59e0b' }, 'Unlikely': { color: '#ef4444' },
    'Conditional/Unassessable': { color: '#6b7280' },
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end gap-3">
        <button className="btn btn-outline" onClick={() => exportCSV(data)}><Download size={14} /> CSV</button>
        <button className="btn btn-success" onClick={() => window.print()}><Printer size={14} /> Print / Save PDF</button>
      </div>

      <div className="card p-6 space-y-6">
        {/* Title block */}
        <div className="text-center pb-5" style={{ borderBottom: '2px solid #30363d' }}>
          <div className="text-2xl font-black tracking-tight mb-1" style={{ color: '#3b82f6' }}>
            ADR Identification Summary Report
          </div>
          <div className="text-sm" style={{ color: '#8b949e' }}>
            PV Task 1 · Workora Synthetic Pharmacovigilance Training Pack · Educational Only
          </div>
          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>Generated: {new Date().toLocaleString()}</div>
        </div>

        {/* Objective */}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8b949e' }}>1. Objective</div>
          <p className="text-sm leading-relaxed" style={{ color: '#8b949e' }}>
            Analyze 18 fictional patient case scenarios to identify potential Adverse Drug Reactions (ADRs).
            Review symptoms, medication history, and timelines to determine suspect drug causality using WHO-UMC criteria.
          </p>
        </div>

        {/* Stats */}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#8b949e' }}>2. Dataset Overview</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.75rem' }}>
            {[
              ['Total Cases', data.length, '#3b82f6'],
              ['Suspect Drugs', drugs.length, '#10b981'],
              ['Serious Events', data.filter(r => r.Seriousness !== 'Not serious').length, '#ef4444'],
              ['Hospitalisations', data.filter(r => r.Seriousness === 'Hospitalisation').length, '#f59e0b'],
              ['Unexpected ADRs', data.filter(r => r.ExpectednessReference === 'Unexpected').length, '#8b5cf6'],
              ['+Rechallenges', data.filter(r => r.Rechallenge === 'Positive').length, '#10b981'],
            ].map(([label, val, color]) => (
              <div key={String(label)} className="p-3 rounded-xl text-center" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
                <div className="text-2xl font-black" style={{ color: color as string }}>{val}</div>
                <div className="text-xs mt-0.5 uppercase tracking-widest font-semibold" style={{ color: '#6b7280' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ADR Table */}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#8b949e' }}>3. ADR Identification Table</div>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Case ID','Drug','Reaction','Onset','Seriousness','Dechallenge','Rechallenge','Causality'].map(h => (
                    <th key={h} style={{ background: '#1c2230', padding: '8px 12px', fontSize: '11px', fontWeight: 700,
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
                    <tr key={r.CaseID} style={{ borderBottom: '1px solid rgba(48,54,61,.4)', background: i % 2 ? 'rgba(28,34,48,.4)' : 'transparent' }}>
                      <td style={{ padding: '8px 12px', color: '#3b82f6', fontWeight: 700 }}>{r.CaseID}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{r.SuspectProduct}</td>
                      <td style={{ padding: '8px 12px' }}>{r.Reaction}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: r.OnsetDays <= 7 ? '#10b981' : r.OnsetDays <= 14 ? '#f59e0b' : '#ef4444' }}>{r.OnsetDays}d</td>
                      <td style={{ padding: '8px 12px' }}><SeriousnessBadge value={r.Seriousness} /></td>
                      <td style={{ padding: '8px 12px' }}><DcBadge value={r.Dechallenge} /></td>
                      <td style={{ padding: '8px 12px' }}><DcBadge value={r.Rechallenge} /></td>
                      <td style={{ padding: '8px 12px' }}><CausalityBadge result={c} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drug analysis */}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#8b949e' }}>4. Drug-Level Analysis</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '0.75rem' }}>
            {drugs.map(d => {
              const cases = data.filter(r => r.SuspectProduct === d);
              const avg = (cases.reduce((s, r) => s + r.OnsetDays, 0) / cases.length).toFixed(1);
              const rxs = [...new Set(cases.map(r => r.Reaction))].join(', ');
              return (
                <div key={d} className="p-3 rounded-xl" style={{ background: '#0d1117', borderLeft: '3px solid #3b82f6' }}>
                  <div className="font-bold text-sm mb-1">💊 {d}</div>
                  <div className="text-xs mb-1" style={{ color: '#8b949e' }}>Cases: <strong style={{ color: '#e6edf3' }}>{cases.length}</strong> · Avg onset: <strong style={{ color: '#f59e0b' }}>{avg}d</strong></div>
                  <div className="text-xs mb-1" style={{ color: '#8b949e' }}>ADR(s): {rxs}</div>
                  <div className="text-xs" style={{ color: '#ef4444' }}>Serious: {cases.filter(r => r.Seriousness !== 'Not serious').length}/{cases.length}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Causality */}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#8b949e' }}>5. Causality Distribution</div>
          <div className="space-y-3">
            {Object.entries(causDist).sort((a, b) => b[1] - a[1]).map(([cat, n]) => {
              const pct = ((n / data.length) * 100).toFixed(0);
              const color = causMeta[cat]?.color || '#6b7280';
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color }}>{cat}</span>
                    <span style={{ color: '#8b949e' }}>{n} cases ({pct}%)</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ background: '#0d1117', height: '7px' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)' }}>
          <div className="text-sm font-bold mb-1" style={{ color: '#ef4444' }}>⚠️ Disclaimer</div>
          <div className="text-xs leading-relaxed" style={{ color: '#8b949e' }}>
            Every case and identifier in this dataset is fictional and de-identified. This report is for educational analysis only
            and must not be used for clinical care, regulatory submission, or real-world pharmacovigilance decisions.
            Do not infer causation from reporting frequency alone. Keep unknown facts unknown; distinguish severity
            from regulatory seriousness; document rationale and limitations behind every classification.
          </div>
        </div>
      </div>
    </div>
  );
};
