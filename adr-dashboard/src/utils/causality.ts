import type { Case, CausalityResult } from '../types';

export function computeCausality(row: Case): CausalityResult {
  let score = 0;
  const rationale: string[] = [];

  // Temporal relationship
  if (row.OnsetDays <= 7) { score += 3; rationale.push('Short onset (≤7d)'); }
  else if (row.OnsetDays <= 21) { score += 2; rationale.push('Moderate onset (8–21d)'); }
  else { score += 1; rationale.push('Delayed onset (>21d)'); }

  // Known reaction
  if (row.ExpectednessReference === 'Known') { score += 2; rationale.push('Labelled reaction'); }
  else { rationale.push('Unlabelled/unexpected'); }

  // Dechallenge
  if (row.Dechallenge === 'Positive') { score += 2; rationale.push('+Dechallenge'); }
  else if (row.Dechallenge === 'Negative') { score -= 1; rationale.push('–Dechallenge'); }

  // Rechallenge
  if (row.Rechallenge === 'Positive') { score += 3; rationale.push('+Rechallenge'); }
  else if (row.Rechallenge === 'Negative') { score -= 1; rationale.push('–Rechallenge'); }

  // Alternative causes
  if (row.ConcomitantMedicines === 'None reported') { score += 1; rationale.push('No concomitants'); }
  else { rationale.push(`Concomitant: ${row.ConcomitantMedicines}`); }

  if (score >= 9) return { category: 'Certain', score, color: '#10b981', rationale };
  if (score >= 7) return { category: 'Probable', score, color: '#3b82f6', rationale };
  if (score >= 4) return { category: 'Possible', score, color: '#f59e0b', rationale };
  if (score >= 2) return { category: 'Unlikely', score, color: '#ef4444', rationale };
  return { category: 'Conditional/Unassessable', score, color: '#6b7280', rationale };
}

export function exportCSV(cases: Case[]) {
  const headers = ['CaseID','Age','Sex','SuspectProduct','Dose','Route','Indication','Reaction',
    'OnsetDays','Expectedness','Seriousness','Dechallenge','Rechallenge','Concomitant','Reporter','Causality'];
  const rows = cases.map(r => {
    const c = computeCausality(r);
    return [r.CaseID, r.Age, r.Sex, r.SuspectProduct, r.Dose, r.Route, r.Indication,
      r.Reaction, r.OnsetDays, r.ExpectednessReference, r.Seriousness, r.Dechallenge,
      r.Rechallenge, r.ConcomitantMedicines, r.Reporter, c.category
    ].map(v => `"${v}"`).join(',');
  });
  const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'ADR_Identification_Report.csv'; a.click();
  URL.revokeObjectURL(url);
}

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function countBy<T>(arr: T[], key: keyof T): Record<string, number> {
  return arr.reduce((acc, item) => {
    const val = String(item[key]);
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export const CHART_COLORS = [
  '#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6',
  '#f97316','#06b6d4','#ec4899','#84cc16','#6366f1',
];
