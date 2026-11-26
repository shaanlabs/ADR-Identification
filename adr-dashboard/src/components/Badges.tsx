import React from 'react';
import type { CausalityResult } from '../types';

export const SeriousnessBadge: React.FC<{ value: string }> = ({ value }) => {
  const styles: Record<string, { bg: string; color: string; border: string; icon: string }> = {
    'Hospitalisation':     { bg:'rgba(245,158,11,.12)', color:'#f59e0b', border:'rgba(245,158,11,.3)', icon:'🏥' },
    'Medically important': { bg:'rgba(59,130,246,.12)',  color:'#3b82f6', border:'rgba(59,130,246,.3)',  icon:'⚕️' },
    'Not serious':         { bg:'rgba(16,185,129,.12)',  color:'#10b981', border:'rgba(16,185,129,.3)',  icon:'✓'  },
  };
  const s = styles[value] || { bg:'rgba(107,114,128,.12)', color:'#6b7280', border:'rgba(107,114,128,.3)', icon:'•' };
  return (
    <span className="badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.icon} {value}
    </span>
  );
};

export const ExpectBadge: React.FC<{ value: string }> = ({ value }) => (
  <span className="badge"
    style={value === 'Known'
      ? { background:'rgba(16,185,129,.12)', color:'#10b981', border:'1px solid rgba(16,185,129,.3)' }
      : { background:'rgba(245,158,11,.12)', color:'#f59e0b', border:'1px solid rgba(245,158,11,.3)' }
    }>
    {value === 'Known' ? '✓ Known' : '⚠ Unexpected'}
  </span>
);

export const DcBadge: React.FC<{ value: string }> = ({ value }) => {
  const styles: Record<string, { bg: string; color: string }> = {
    Positive:  { bg:'rgba(16,185,129,.12)',  color:'#10b981' },
    Negative:  { bg:'rgba(239,68,68,.12)',   color:'#ef4444' },
    Unknown:   { bg:'rgba(107,114,128,.12)', color:'#8b949e' },
    'Not done':{ bg:'rgba(107,114,128,.12)', color:'#8b949e' },
  };
  const s = styles[value] || styles.Unknown;
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{value}</span>;
};

export const CausalityBadge: React.FC<{ result: CausalityResult }> = ({ result }) => (
  <span className="badge" style={{
    background: `${result.color}18`,
    color: result.color,
    border: `1px solid ${result.color}40`,
  }}>
    {result.category}
  </span>
);
