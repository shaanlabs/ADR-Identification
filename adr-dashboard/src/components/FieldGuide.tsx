import React from 'react';
import { FIELD_GUIDE, PV_CONCEPTS } from '../data/cases';
import { CheckCircle2, Circle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export const FieldGuide: React.FC = () => (
  <div className="space-y-5">
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 p-4" style={{ background: 'linear-gradient(135deg,rgba(59,130,246,.12),rgba(139,92,246,.08))', borderBottom: '1px solid #30363d' }}>
        <BookOpen size={15} style={{ color: '#3b82f6' }} />
        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8b949e' }}>Minimum Case Validity Criteria</h3>
      </div>
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              {['Field', 'Required?', 'Notes', 'Source'].map(h => (
                <th key={h} style={{ background: '#1c2230', padding: '10px 16px', fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '.5px', color: '#8b949e', borderBottom: '1px solid #30363d', textAlign: 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIELD_GUIDE.map((f, i) => (
              <motion.tr key={f.field} className="table-row-hover"
                style={{ borderBottom: '1px solid rgba(48,54,61,.4)' }}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '13px' }}>{f.field}</td>
                <td style={{ padding: '12px 16px' }}>
                  {f.required
                    ? <span className="badge" style={{ background: 'rgba(16,185,129,.12)', color: '#10b981', border: '1px solid rgba(16,185,129,.3)' }}>
                        <CheckCircle2 size={11} /> Required
                      </span>
                    : <span className="badge" style={{ background: 'rgba(107,114,128,.12)', color: '#6b7280', border: '1px solid rgba(107,114,128,.3)' }}>
                        <Circle size={11} /> Optional
                      </span>}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#8b949e' }}>{f.notes}</td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#3b82f6' }}>{f.source}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="card p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8b949e' }}>
        📚 Key Pharmacovigilance Concepts
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
        {PV_CONCEPTS.map((c, i) => (
          <motion.div key={c.title}
            className="p-4 rounded-xl"
            style={{ background: '#0d1117', border: '1px solid #30363d' }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ borderColor: '#3b82f6', background: 'rgba(59,130,246,.04)' }}>
            <div className="font-bold text-sm mb-2">{c.icon} {c.title}</div>
            <div className="text-xs leading-relaxed" style={{ color: '#8b949e' }}>{c.body}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
