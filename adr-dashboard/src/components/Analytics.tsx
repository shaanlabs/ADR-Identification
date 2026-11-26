import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
  ScatterChart, Scatter, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import type { Case } from '../types';
import { countBy, CHART_COLORS } from '../utils/causality';
import { computeCausality } from '../utils/causality';

interface Props { data: Case[] }

const CardChart: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="card p-5">
    <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8b949e' }}>{title}</h3>
    {children}
  </div>
);

const TIP: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-xs" style={{ background: '#1c2230' }}>
      {label && <p className="font-bold mb-1" style={{ color: '#e6edf3' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export const Analytics: React.FC<Props> = ({ data }) => {
  // Drug × reaction stacked bar
  const drugs = [...new Set(data.map(r => r.SuspectProduct))].sort();
  const reactions = [...new Set(data.map(r => r.Reaction))].sort();
  const drugBarData = drugs.map(d => {
    const obj: Record<string, string | number> = { drug: d };
    reactions.forEach(rx => { obj[rx] = data.filter(r => r.SuspectProduct === d && r.Reaction === rx).length; });
    return obj;
  });

  // Seriousness pie
  const serData = Object.entries(countBy(data, 'Seriousness')).map(([name, value]) => ({ name, value }));

  // Onset histogram
  const onsetBuckets = [
    { label: '1–5d',  value: data.filter(r => r.OnsetDays <= 5).length },
    { label: '6–10d', value: data.filter(r => r.OnsetDays > 5 && r.OnsetDays <= 10).length },
    { label: '11–15d',value: data.filter(r => r.OnsetDays > 10 && r.OnsetDays <= 15).length },
    { label: '16–21d',value: data.filter(r => r.OnsetDays > 15).length },
  ];

  // Reporter pie
  const repData = Object.entries(countBy(data, 'Reporter')).map(([name, value]) => ({ name, value }));

  // Expect
  const expData = Object.entries(countBy(data, 'ExpectednessReference')).map(([name, value]) => ({ name, value }));

  // Scatter
  const scatterData = data.map(r => ({ x: r.Age, y: r.OnsetDays, z: r.SuspectProduct, id: r.CaseID }));

  // Causality distribution
  const causDist = data.reduce((acc, r) => {
    const c = computeCausality(r);
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const causData = Object.entries(causDist).map(([name, value]) => ({ name, value }));

  // Radar: drug risk profile
  const radarData = drugs.map(d => {
    const cases = data.filter(r => r.SuspectProduct === d);
    return {
      drug: d,
      Cases: cases.length,
      Serious: cases.filter(r => r.Seriousness !== 'Not serious').length,
      Hospitalisations: cases.filter(r => r.Seriousness === 'Hospitalisation').length,
      Unexpected: cases.filter(r => r.ExpectednessReference === 'Unexpected').length,
      PosRechallenge: cases.filter(r => r.Rechallenge === 'Positive').length,
    };
  });

  const SER_COLORS = ['#ef4444','#f59e0b','#10b981'];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))' }}>

        <CardChart title="Reactions by Drug (Stacked)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={drugBarData} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="drug" tick={{ fill: '#8b949e', fontSize: 10 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill: '#8b949e', fontSize: 10 }} allowDecimals={false} />
              <Tooltip content={<TIP />} />
              <Legend wrapperStyle={{ fontSize: 10, color: '#8b949e', paddingTop: 8 }} />
              {reactions.map((rx, i) => (
                <Bar key={rx} dataKey={rx} stackId="a" fill={CHART_COLORS[i % CHART_COLORS.length]} radius={i === reactions.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardChart>

        <CardChart title="Seriousness Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={serData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {serData.map((_, i) => <Cell key={i} fill={SER_COLORS[i % SER_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<TIP />} />
            </PieChart>
          </ResponsiveContainer>
        </CardChart>

        <CardChart title="Onset Days Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={onsetBuckets} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="label" tick={{ fill: '#8b949e', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<TIP />} />
              <Bar dataKey="value" name="Cases" radius={[6, 6, 0, 0]}>
                {onsetBuckets.map((_, i) => <Cell key={i} fill={['#10b981','#3b82f6','#f59e0b','#ef4444'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardChart>

        <CardChart title="Reporter Type">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={repData} cx="50%" cy="50%" outerRadius={85} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {repData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<TIP />} />
            </PieChart>
          </ResponsiveContainer>
        </CardChart>

        <CardChart title="Expectedness (Known vs Unexpected)">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                <Cell fill="#10b981" /><Cell fill="#f59e0b" />
              </Pie>
              <Tooltip content={<TIP />} />
            </PieChart>
          </ResponsiveContainer>
        </CardChart>

        <CardChart title="Causality Category Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={causData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis type="number" tick={{ fill: '#8b949e', fontSize: 10 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#8b949e', fontSize: 10 }} width={110} />
              <Tooltip content={<TIP />} />
              <Bar dataKey="value" name="Cases" radius={[0, 6, 6, 0]}>
                {causData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardChart>
      </div>

      {/* Scatter full width */}
      <CardChart title="Age vs Onset Days — All Cases">
        <ResponsiveContainer width="100%" height={260}>
          <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis type="number" dataKey="x" name="Age" unit="yr" tick={{ fill: '#8b949e', fontSize: 11 }}
              label={{ value: 'Patient Age (years)', position: 'insideBottom', offset: -4, fill: '#8b949e', fontSize: 11 }} />
            <YAxis type="number" dataKey="y" name="Onset" unit="d" tick={{ fill: '#8b949e', fontSize: 11 }}
              label={{ value: 'Onset Days', angle: -90, position: 'insideLeft', fill: '#8b949e', fontSize: 11 }} />
            <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#30363d' }}
              content={({ active, payload }) => active && payload?.length
                ? <div className="card p-3 text-xs" style={{ background: '#1c2230' }}>
                    <p className="font-bold" style={{ color: '#3b82f6' }}>{payload[0].payload.id}</p>
                    <p style={{ color: '#8b949e' }}>Age: {payload[0].payload.x}yr · Onset: {payload[0].payload.y}d</p>
                    <p style={{ color: '#8b949e' }}>{payload[0].payload.z}</p>
                  </div>
                : null} />
            <Scatter name="Cases" data={scatterData} fill="#3b82f6" fillOpacity={0.8} />
          </ScatterChart>
        </ResponsiveContainer>
      </CardChart>

      {/* Radar drug risk */}
      <CardChart title="Drug Risk Profile Radar">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#30363d" />
            <PolarAngleAxis dataKey="drug" tick={{ fill: '#8b949e', fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fill: '#8b949e', fontSize: 9 }} />
            {['Cases','Serious','Hospitalisations','Unexpected','PosRechallenge'].map((key, i) => (
              <Radar key={key} name={key} dataKey={key} stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.1} />
            ))}
            <Legend wrapperStyle={{ fontSize: 11, color: '#8b949e' }} />
            <Tooltip content={<TIP />} />
          </RadarChart>
        </ResponsiveContainer>
      </CardChart>
    </div>
  );
};
