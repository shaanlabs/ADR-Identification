import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import type { Case } from '../types';
import { computeCausality } from '../utils/causality';
import { SeriousnessBadge, ExpectBadge, DcBadge, CausalityBadge } from './Badges';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

const col = createColumnHelper<Case>();

interface Props {
  data: Case[];
  onRowClick: (c: Case) => void;
}

export const CaseTable: React.FC<Props> = ({ data, onRowClick }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(() => [
    col.accessor('CaseID', {
      header: 'Case ID',
      cell: i => <span className="font-bold text-xs" style={{ color: '#3b82f6' }}>{i.getValue()}</span>,
    }),
    col.accessor(r => `${r.Age}y / ${r.Sex}`, {
      id: 'patient',
      header: 'Patient',
      cell: i => <span className="text-xs" style={{ color: '#e6edf3' }}>{i.getValue()}</span>,
      enableSorting: false,
    }),
    col.accessor('SuspectProduct', {
      header: 'Suspect Drug',
      cell: i => <span className="font-semibold text-xs">{i.getValue()}</span>,
    }),
    col.accessor('Dose', {
      header: 'Dose / Route',
      cell: i => {
        const row = i.row.original;
        return <span className="text-xs" style={{ color: '#8b949e' }}>{row.Dose}<br />{row.Route}</span>;
      },
      enableSorting: false,
    }),
    col.accessor('Indication', {
      header: 'Indication',
      cell: i => <span className="text-xs" style={{ color: '#8b949e' }}>{i.getValue()}</span>,
    }),
    col.accessor('Reaction', {
      header: 'Reaction',
      cell: i => <span className="font-semibold text-xs" style={{ color: '#e6edf3' }}>{i.getValue()}</span>,
    }),
    col.accessor('OnsetDays', {
      header: 'Onset',
      cell: i => {
        const v = i.getValue();
        const color = v <= 7 ? '#10b981' : v <= 14 ? '#f59e0b' : '#ef4444';
        return <span className="font-bold text-xs" style={{ color }}>{v}d</span>;
      },
    }),
    col.accessor('ExpectednessReference', {
      header: 'Expectedness',
      cell: i => <ExpectBadge value={i.getValue()} />,
    }),
    col.accessor('Seriousness', {
      header: 'Seriousness',
      cell: i => <SeriousnessBadge value={i.getValue()} />,
    }),
    col.accessor('Dechallenge', {
      header: 'Dechallenge',
      cell: i => <DcBadge value={i.getValue()} />,
    }),
    col.accessor('Rechallenge', {
      header: 'Rechallenge',
      cell: i => <DcBadge value={i.getValue()} />,
    }),
    col.accessor('ConcomitantMedicines', {
      header: 'Concomitant',
      cell: i => <span className="text-xs" style={{ color: '#8b949e' }}>{i.getValue()}</span>,
    }),
    col.display({
      id: 'causality',
      header: 'Causality',
      cell: i => <CausalityBadge result={computeCausality(i.row.original)} />,
    }),
    col.accessor('Reporter', {
      header: 'Reporter',
      cell: i => <span className="text-xs" style={{ color: '#8b949e' }}>{i.getValue()}</span>,
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const drugs = [...new Set(data.map(r => r.SuspectProduct))].sort();
  const reporters = [...new Set(data.map(r => r.Reporter))].sort();

  return (
    <div className="space-y-3">
      {/* Filter Bar */}
      <div className="card p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#8b949e' }}>Search</label>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8b949e' }} />
            <input
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Case ID, drug, reaction…"
              className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3' }}
              onFocus={e => (e.target.style.borderColor = '#3b82f6')}
              onBlur={e => (e.target.style.borderColor = '#30363d')}
            />
          </div>
        </div>
        {[
          { label: 'Drug', options: drugs, col: 'SuspectProduct' },
          { label: 'Seriousness', options: ['Not serious','Medically important','Hospitalisation'], col: 'Seriousness' },
          { label: 'Expectedness', options: ['Known','Unexpected'], col: 'ExpectednessReference' },
          { label: 'Reporter', options: reporters, col: 'Reporter' },
        ].map(f => (
          <div key={f.col} className="flex-1 min-w-36">
            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#8b949e' }}>{f.label}</label>
            <select
              value={(columnFilters.find(cf => cf.id === f.col)?.value as string) || ''}
              onChange={e => {
                setColumnFilters(prev =>
                  e.target.value
                    ? [...prev.filter(cf => cf.id !== f.col), { id: f.col, value: e.target.value }]
                    : prev.filter(cf => cf.id !== f.col)
                );
              }}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3' }}
            >
              <option value="">All</option>
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <button
          onClick={() => { setGlobalFilter(''); setColumnFilters([]); }}
          className="btn btn-outline flex items-center gap-1"
          style={{ alignSelf: 'flex-end', whiteSpace: 'nowrap' }}
        >
          <X size={13} /> Clear
        </button>
      </div>

      <div className="text-xs mb-1" style={{ color: '#8b949e' }}>
        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
        {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{' '}
        {table.getFilteredRowModel().rows.length} cases
      </div>

      {/* Table */}
      <div className="card overflow-auto" style={{ maxHeight: '520px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr>
              {table.getFlatHeaders().map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                  className={header.column.getCanSort() ? 'sort-th' : ''}
                  style={{
                    background: '#1c2230', padding: '10px 14px',
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '.5px', color: '#8b949e',
                    borderBottom: '1px solid #30363d', whiteSpace: 'nowrap',
                    textAlign: 'left', userSelect: 'none',
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      header.column.getIsSorted() === 'asc' ? <ChevronUp size={12} />
                      : header.column.getIsSorted() === 'desc' ? <ChevronDown size={12} />
                      : <ChevronsUpDown size={11} style={{ opacity: .4 }} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <motion.tr
                key={row.id}
                className="table-row-hover"
                onClick={() => onRowClick(row.original)}
                style={{ borderBottom: '1px solid rgba(48,54,61,.5)', cursor: 'pointer' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs" style={{ color: '#8b949e' }}>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-1.5">
          {['«','‹'].map((s, i) => (
            <button key={s} onClick={() => i === 0 ? table.setPageIndex(0) : table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all"
              style={{ background: '#161b22', border: '1px solid #30363d', color: table.getCanPreviousPage() ? '#e6edf3' : '#30363d' }}>
              {s}
            </button>
          ))}
          {Array.from({ length: table.getPageCount() }, (_, i) => (
            <button key={i} onClick={() => table.setPageIndex(i)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: table.getState().pagination.pageIndex === i
                  ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : '#161b22',
                border: `1px solid ${table.getState().pagination.pageIndex === i ? 'transparent' : '#30363d'}`,
                color: table.getState().pagination.pageIndex === i ? '#fff' : '#8b949e',
              }}>
              {i + 1}
            </button>
          ))}
          {['›','»'].map((s, i) => (
            <button key={s} onClick={() => i === 0 ? table.nextPage() : table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all"
              style={{ background: '#161b22', border: '1px solid #30363d', color: table.getCanNextPage() ? '#e6edf3' : '#30363d' }}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
