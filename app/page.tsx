'use client';

import { useMemo, useState } from 'react';

type Supplier = {
  id: string;
  name: string;
  category: 'Direct' | 'Indirect';
  status: 'Approved' | 'Pending';
  country?: string;
};

type RFQ = {
  id: string;
  title: string;
  category: 'Direct' | 'Indirect';
  status: 'Open' | 'Closed';
  dueDate?: string;
};

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

const initialSuppliers: Supplier[] = [
  { id: uid('sup'), name: 'Alpha Chemicals', category: 'Direct', status: 'Approved', country: 'ZA' },
  { id: uid('sup'), name: 'Beta Packaging', category: 'Indirect', status: 'Pending', country: 'TR' },
  { id: uid('sup'), name: 'Gamma IT', category: 'Indirect', status: 'Approved', country: 'ZA' },
];

const initialRfqs: RFQ[] = [
  { id: uid('rfq'), title: 'RFQ: Sodium Hypochlorite', category: 'Direct', status: 'Open', dueDate: '2025-10-30' },
  { id: uid('rfq'), title: 'RFP: Helpdesk Services', category: 'Indirect', status: 'Closed', dueDate: '2025-09-15' },
];

export default function Page() {
  const [role, setRole] = useState<'Admin' | 'Buyer' | 'Approver' | 'Supplier'>('Admin');
  const [tab, setTab] = useState<'overview' | 'suppliers' | 'rfqs' | 'settings'>('overview');

  const suppliers = initialSuppliers;
  const rfqs = initialRfqs;

  const counts = useMemo(() => {
    return {
      directApproved: suppliers.filter(s => s.category === 'Direct' && s.status === 'Approved').length,
      indirectApproved: suppliers.filter(s => s.category === 'Indirect' && s.status === 'Approved').length,
      openDirect: rfqs.filter(r => r.category === 'Direct' && r.status === 'Open').length,
      openIndirect: rfqs.filter(r => r.category === 'Indirect' && r.status === 'Open').length,
    };
  }, [suppliers, rfqs]);

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-content-center font-bold">
              PL
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">ProcureLink</h1>
              <p className="text-sm text-slate-500 -mt-1">Direct &amp; Indirect procurement collaboration</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="input w-[160px]"
              value={role}
              onChange={e => setRole(e.target.value as any)}
            >
              <option>Admin</option>
              <option>Buyer</option>
              <option>Approver</option>
              <option>Supplier</option>
            </select>
            <button className="btn">+ Quick Add</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {(['overview', 'suppliers', 'rfqs', 'settings'] as const).map(t => (
            <button
              key={t}
              className={'tab ' + (tab === t ? 'active' : '')}
              onClick={() => setTab(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold mb-2">Direct</h3>
              <p className="text-sm text-slate-500">Approved suppliers: {counts.directApproved}</p>
              <p className="text-sm text-slate-500">Open RFQs: {counts.openDirect}</p>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold mb-2">Indirect</h3>
              <p className="text-sm text-slate-500">Approved suppliers: {counts.indirectApproved}</p>
              <p className="text-sm text-slate-500">Open RFQs: {counts.openIndirect}</p>
            </div>
          </div>
        )}

        {/* SUPPLIERS */}
        {tab === 'suppliers' && (
          <div className="card p-5 grid gap-4">
            <h3 className="font-semibold">Supplier Directory</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {suppliers.map(s => (
                <div key={s.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.category} {s.country ? `· ${s.country}` : ''}</div>
                    </div>
                    <span className="badge px-2 py-0.5 rounded-md text-xs">{s.status}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="btn secondary">View</button>
                    <button className="btn">Invite</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RFQS */}
        {tab === 'rfqs' && (
          <div className="card p-5 grid gap-4">
            <h3 className="font-semibold">Open RFQs &amp; RFPs</h3>
            <div className="grid gap-3">
              {rfqs.map(r => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs text-slate-500">
                        {r.category} · {r.status} {r.dueDate ? `· Due ${r.dueDate}` : ''}
                      </div>
                    </div>
                    <button className="btn">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="card p-5 grid gap-4">
            <h3 className="font-semibold">Settings</h3>
            <div className="grid gap-2">
              <div className="text-sm text-slate-500">
                Your role: <span className="badge px-2 py-0.5 rounded-md">{role}</span>
              </div>
              <div className="text-sm text-slate-500">
                (Branding, theme, and integrations will go here.)
              </div>
            </div>
          </div>
        )}

        <footer className="text-xs text-slate-500 mt-8">© 2025 ProcureLink · MVP</footer>
      </div>
    </div>
  );
}

