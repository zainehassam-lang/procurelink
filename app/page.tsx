import Carousel from '@/components/Carousel';
import PosterCard from '@/components/PosterCard';
'use client';
import { useMemo, useState } from 'react';
import Section from '@/components/Section';
import Field from '@/components/Field';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Category = 'Direct' | 'Indirect';
type Status = 'Prospect' | 'Onboarding' | 'Approved' | 'Blocked';
type RiskType = 'Quality' | 'Financial' | 'Geo' | 'Compliance' | 'FX' | 'Logistics';

interface Supplier { id: string; name: string; category: Category; email: string; country?: string; bbbeeLevel?: string; status: Status; docs: string[]; }
interface RFQ { id: string; title: string; category: Category; scope: string; incoterm?: string; paymentTerms?: string; dueDate?: string; invitedSupplierIds: string[]; status: 'Draft'|'Open'|'Closed'|'Awarded' }
interface BidLine { supplierId: string; item: string; uom: string; qty: number; unitPrice: number; leadTimeDays: number; }
interface EvalCriteria { price:number; quality:number; onTime:number; leadTime:number; service:number; risk:number; sustainability:number; }
interface RiskRow { id:string; supplierId:string; type:RiskType; likelihood:number; impact:number; owner:string; due:string; mitigation:string; status:'Open'|'Mitigating'|'Closed' }

const seedSuppliers: Supplier[] = [
  { id:'sup_1', name:'Alpha Chemicals', category:'Direct', email:'alpha@example.com', country:'ZA', bbbeeLevel:'2', status:'Approved', docs:['Tax Clearance.pdf','BBBEE.pdf']},
  { id:'sup_2', name:'Beta Logistics', category:'Direct', email:'beta@example.com', country:'ZA', status:'Approved', docs:['SLA.pdf']},
  { id:'sup_3', name:'Gamma IT', category:'Indirect', email:'gamma@example.com', country:'TR', status:'Onboarding', docs:[]},
  { id:'sup_4', name:'Delta Facilities', category:'Indirect', email:'delta@example.com', country:'ZA', bbbeeLevel:'4', status:'Prospect', docs:[]},
];
const seedRFQs: RFQ[] = [
  { id:'rfq_1', title:'Sodium Hypochlorite 12.5% — SSA Q1', category:'Direct', scope:'Bulk supply, min 10 000L/month, spec ISO9001', incoterm:'CIF', paymentTerms:'EOM + 30', dueDate:'2025-10-31', invitedSupplierIds:['sup_1','sup_2'], status:'Open'},
  { id:'rfq_2', title:'IT Helpdesk & Field Support (MEA)', category:'Indirect', scope:'24/7 L1/L2 helpdesk, SLA 95% < 4h', paymentTerms:'30 days', dueDate:'2025-11-10', invitedSupplierIds:['sup_3'], status:'Draft'},
];
const seedBids: BidLine[] = [
  { supplierId:'sup_1', item:'Sodium Hypochlorite 12.5%', uom:'L', qty:10000, unitPrice:0.90, leadTimeDays:7 },
  { supplierId:'sup_2', item:'Transport (bulk chemical)', uom:'trip', qty:20, unitPrice:1800, leadTimeDays:3 },
  { supplierId:'sup_3', item:'Helpdesk seat (per month)', uom:'seat', qty:20, unitPrice:450, leadTimeDays:0 },
];
const seedCriteria: EvalCriteria = { price:30, quality:20, onTime:15, leadTime:10, service:15, risk:5, sustainability:5 };
const seedRisks: RiskRow[] = [
  { id:'r1', supplierId:'sup_1', type:'Quality', likelihood:2, impact:4, owner:'QA Lead', due:'2025-11-15', mitigation:'Increase QC frequency; site audit', status:'Open' },
  { id:'r2', supplierId:'sup_3', type:'Compliance', likelihood:3, impact:3, owner:'Procurement', due:'2025-12-01', mitigation:'SOC2 clause; quarterly evidence', status:'Mitigating' },
];
const perfSeries = [
  { month:'2025-06', onTime:92, sla:90 },
  { month:'2025-07', onTime:94, sla:92 },
  { month:'2025-08', onTime:95, sla:94 },
  { month:'2025-09', onTime:96, sla:95 },
];

const id = (p='id') => `${p}_${Math.random().toString(36).slice(2,8)}`;
const calcWeighted = (c:EvalCriteria, a:number,b:number,c1:number,d:number,e:number,f:number,g:number)=>{
  const total = c.price+c.quality+c.onTime+c.leadTime+c.service+c.risk+c.sustainability;
  const w = a*c.price+b*c.quality+c1*c.onTime+d*c.leadTime+e*c.service+f*c.risk+g*c.sustainability;
  return Math.round((w/total)*100)/100;
};

export default function Page(){
  const [tab, setTab] = useState<'overview'|'suppliers'|'rfqs'|'evals'|'risks'|'performance'|'contracts'|'settings'>('overview');
  const [role, setRole] = useState<'Admin'|'Buyer'|'Approver'|'Supplier'>('Admin');
  const [suppliers, setSuppliers] = useState<Supplier[]>(seedSuppliers);
  const [rfqs, setRfqs] = useState<RFQ[]>(seedRFQs);
  const [bids, setBids] = useState<BidLine[]>(seedBids);
  const [criteria, setCriteria] = useState<EvalCriteria>(seedCriteria);
  const [risks, setRisks] = useState<RiskRow[]>(seedRisks);
  const supplierMap = useMemo(()=>Object.fromEntries(suppliers.map(s=>[s.id,s])),[suppliers]);

  const ranked = useMemo(()=> suppliers.map(s=>{
    const score = calcWeighted(criteria,4,4,4,3.5,4, s.status==='Approved'?4:3, s.bbbeeLevel? (6-Math.min(5, Number(s.bbbeeLevel)))*0.8+2 : 3);
    return { s, score };
  }).sort((a,b)=>b.score-a.score), [suppliers, criteria]);

  const inviteLink = `https://procurelink.example/invite/${id('org')}`;
  
  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-content-center font-bold">PL</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">ProcureLink</h1>
              <p className="text-sm text-slate-500 -mt-1">Direct & Indirect procurement collaboration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select className="input w-[160px]" value={role} onChange={e=>setRole(e.target.value as any)}>
              <option>Admin</option><option>Buyer</option><option>Approver</option><option>Supplier</option>
            </select>
            <button className="btn">+ Quick Add</button>
          </div>
        </div>

        <div className="tabs">
          {['overview','suppliers','rfqs','evals','risks','performance','contracts','settings'].map(t=>(
            <button key={t} className={'tab '+(tab===t?'active':'')} onClick={()=>setTab(t as any)}>{t.toString().toUpperCase()}</button>
          ))}
        </div>

       {tab==='overview' && (
  <div className="grid gap-6">
    {/* HERO */}
    <div className="rounded-2xl relative overflow-hidden" style={{background:'linear-gradient(90deg,#111,#1a1a22)'}}>
      <div className="p-6 md:p-10">
        <div className="text-2xl md:text-3xl font-bold">ProcureLink</div>
        <div className="text-sm md:text-base text-slate-300 mt-1">
          Invite suppliers, collect bids, evaluate, award, and monitor — all in one place.
        </div>
        <div className="mt-4 flex gap-2">
          <button className="btn">+ Create RFQ</button>
          <button className="btn secondary">Invite Supplier</button>
        </div>
      </div>
    </div>

    {/* ROW 1 */}
    <div>
      <h2 className="text-lg font-semibold mb-2">Trending RFQs</h2>
      <Carousel>
        {rfqs.slice(0,6).map(r=>(
          <PosterCard key={r.id} title={r.title} subtitle={r.status} />
        ))}
      </Carousel>
    </div>

    {/* ROW 2 */}
    <div>
      <h2 className="text-lg font-semibold mb-2">Top Suppliers</h2>
      <Carousel>
        {suppliers.slice(0,6).map(s=>(
          <PosterCard key={s.id} title={s.name} subtitle={s.category} />
        ))}
      </Carousel>
    </div>
  </div>
)}

          </div>
        )}

        {tab==='suppliers' && (
          <div className="card p-5 grid gap-5">
            <Section title="Supplier Directory" />
            <div className="grid gap-3 md:grid-cols-2">
              {suppliers.map(s=>(
                <div key={s.id} className="p-4 border rounded-2xl bg-white">
                  <div className="flex items-center justify-between">
                    <div><div className="font-semibold">{s.name}</div><div className="text-xs text-slate-500">{s.category}</div></div>
                    <span className="badge">{s.status}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{s.email} · {s.country} {s.bbbeeLevel?`· BBBEE ${s.bbbeeLevel}`:''}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="btn secondary">Upload Docs</button>
                    <button className="btn">Invite</button>
                  </div>
                  {s.docs.length>0 && <ul className="mt-3 text-xs list-disc ml-4">{s.docs.map((d,i)=>(<li key={i}>{d}</li>))}</ul>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='rfqs' && (
          <div className="card p-5 grid gap-5">
            <Section title="RFQs / RFPs" />
            <div className="grid gap-3">
              {rfqs.map(r=>(
                <div key={r.id} className="p-4 border rounded-2xl bg-white">
                  <div className="flex items-center justify-between">
                    <div><div className="font-semibold">{r.title}</div><div className="text-xs text-slate-500">{r.category} · Due {r.dueDate || 'TBA'}</div></div>
                    <span className="badge">{r.status}</span>
                  </div>
                  <p className="text-sm mt-2">{r.scope}</p>
                  <div className="text-xs text-slate-500 mt-1">{r.incoterm?`Incoterm ${r.incoterm} · `:''}{r.paymentTerms?`Payment: ${r.paymentTerms}`:''}</div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {r.invitedSupplierIds.map(sid => (<span key={sid} className="badge">{supplierMap[sid]?.name || sid}</span>))}
                    <button className="btn secondary">Invite supplier</button>
                    <button className="btn">Open Q&A</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='evals' && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-5 md:col-span-2 grid gap-5">
              <Section title="Supplier Evaluation" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-slate-500"><th className="py-2">Supplier</th><th>Category</th><th>Score</th><th>Rank</th></tr></thead>
                  <tbody>
                    {suppliers.map((s, i) => {
                      const score = ranked.find(r=>r.s.id===s.id)?.score ?? 0;
                      const rank = ranked.findIndex(r=>r.s.id===s.id)+1;
                      return (<tr key={s.id} className="border-t"><td className="py-2 font-medium">{s.name}</td><td>{s.category}</td><td>{score.toFixed(2)} / 5</td><td>#{rank}</td></tr>)
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card p-5 grid gap-3">
              <Section title="Weights" />
              {Object.entries(criteria).map(([k,v]) => (
                <Field key={k} label={k.replace(/([A-Z])/g,' $1') + ' %'}>
                  <input className="input" type="number" value={v} onChange={e=>setCriteria({...criteria, [k]: Number(e.target.value)})} />
                </Field>
              ))}
              <div className="text-xs text-slate-500">Ensure weights sum to ~100 for balanced scoring.</div>
            </div>
          </div>
        )}

        {tab==='risks' && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-5 md:col-span-2 grid gap-4">
              <Section title="Risk Register" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-slate-500"><th className="py-2">Supplier</th><th>Type</th><th>Score</th><th>Level</th><th>Owner</th><th>Due</th><th>Mitigation</th><th>Status</th></tr></thead>
                  <tbody>
                    {risks.map(r => {
                      const s = supplierMap[r.supplierId];
                      const score = r.likelihood * r.impact;
                      const lvl = score>=16?'High':score>=9?'Medium':'Low';
                      return (<tr key={r.id} className="border-t">
                        <td className="py-2 font-medium">{s?.name || r.supplierId}</td><td>{r.type}</td><td>{score}</td>
                        <td><span className="badge">{lvl}</span></td><td>{r.owner}</td><td>{r.due}</td><td className="max-w-[280px]">{r.mitigation}</td><td>{r.status}</td>
                      </tr>)
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card p-5 grid gap-3">
              <Section title="Add Risk" />
              <Field label="Supplier">
                <select className="input" id="rs">{suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
              </Field>
              <Field label="Type">
                <select className="input" id="rt">{['Quality','Financial','Geo','Compliance','FX','Logistics'].map(t=><option key={t}>{t}</option>)}</select>
              </Field>
              <Field label="Likelihood (1-5)"><input className="input" id="rl" type="number" defaultValue={3}/></Field>
              <Field label="Impact (1-5)"><input className="input" id="ri" type="number" defaultValue={3}/></Field>
              <Field label="Owner"><input className="input" id="ro" placeholder="Risk owner"/></Field>
              <Field label="Due"><input className="input" id="rd" type="date"/></Field>
              <Field label="Mitigation"><textarea className="input" id="rm" placeholder="Action plan"/></Field>
              <button className="btn" onClick={()=>alert('In this MVP, connect to a database to persist risks.')}>Add</button>
            </div>
          </div>
        )}

        {tab==='performance' && (
          <div className="card p-5">
            <Section title="Performance Dashboard" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month:'2025-06', onTime:92, sla:90 },
                  { month:'2025-07', onTime:94, sla:92 },
                  { month:'2025-08', onTime:95, sla:94 },
                  { month:'2025-09', onTime:96, sla:95 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
                  <Line type="monotone" dataKey="onTime" /><Line type="monotone" dataKey="sla" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {tab==='contracts' && (
          <div className="card p-5 grid gap-4">
            <Section title="Contracts & Renewals" />
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 border rounded-2xl bg-white">
                <div className="font-semibold">Master Service Agreement — Gamma IT</div>
                <div className="text-xs text-slate-500">Term: 2025-01-01 → 2026-12-31 · Renewal window: -45 days</div>
                <div className="mt-2 flex items-center gap-2"><span className="badge">Indirect</span><span className="badge">Active</span></div>
                <div className="mt-3 flex items-center gap-2"><button className="btn secondary">Download</button><button className="btn">Upload addendum</button></div>
              </div>
              <div className="p-4 border rounded-2xl bg-white">
                <div className="font-semibold">Supply Agreement — Alpha Chemicals</div>
                <div className="text-xs text-slate-500">Term: 2025-04-01 → 2026-03-31 · Renewal window: -60 days</div>
                <div className="mt-2 flex items-center gap-2"><span className="badge">Direct</span><span className="badge">Active</span></div>
                <div className="mt-3 flex items-center gap-2"><button className="btn secondary">Download</button><button className="btn">Upload addendum</button></div>
              </div>
            </div>
          </div>
        )}

        {tab==='settings' && (
          <div className="card p-5 grid gap-6">
            <Section title="Organization & Access" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Field label="Org Name"><input className="input" defaultValue="Zaine Hassam Consulting" /></Field>
                <Field label="Invite Link">
                  <div className="flex items-center gap-2">
                    <input className="input" readOnly value={inviteLink} />
                    <button className="btn secondary">Copy</button>
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Allow supplier portal"><input type="checkbox" defaultChecked /></Field>
                  <Field label="Require BBBEE on onboarding"><input type="checkbox" /></Field>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="text-sm font-medium mb-1">Roles & Permissions</div>
                {[
                  { name: 'Admin', desc: 'Full access, billing, org settings' },
                  { name: 'Buyer', desc: 'Create RFQs, evaluate, award' },
                  { name: 'Approver', desc: 'Approve awards & contracts' },
                  { name: 'Supplier', desc: 'Bid, upload docs, view awards' },
                ].map(r => (
                  <div key={r.name} className="p-3 border rounded-2xl bg-white flex items-center justify-between">
                    <div><div className="font-medium">{r.name}</div><div className="text-xs text-slate-500">{r.desc}</div></div>
                    <span className="badge">Enabled</span>
                  </div>
                ))}
              </div>
            </div>
            <Section title="Branding" />
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-2xl bg-white grid place-items-center h-28 text-sm text-slate-500">Upload Logo (PNG)</div>
              <div className="p-4 border rounded-2xl bg-white"><div className="label">Primary color</div><input type="color" defaultValue="#111827" className="w-full h-10 rounded-xl" /></div>
              <div className="p-4 border rounded-2xl bg-white"><div className="label">Accent color</div><input type="color" defaultValue="#0ea5e9" className="w-full h-10 rounded-xl" /></div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="btn">Save settings</button>
              <button className="btn secondary">Export data (CSV)</button>
            </div>
            <div className="text-xs text-slate-500"><b>Next step:</b> connect Supabase for login, storage and real-time RFQ Q&A.</div>
          </div>
        )}

        <div className="text-center text-xs text-slate-500 py-6">© {new Date().getFullYear()} ProcureLink · MVP</div>
      </div>
    </div>
  );
}
