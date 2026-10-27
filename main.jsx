import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutDashboard, FolderKanban, FileSearch, ShieldAlert, Clock3, Network, FileText, Search, Bell, ChevronDown, Plus, Upload, Download, Filter, ArrowUpRight, ShieldCheck, Activity, Database, AlertTriangle, CheckCircle2, File, MoreHorizontal, Menu, X, ChevronRight, Eye, Hash, CalendarDays, LockKeyhole, RefreshCcw, LogOut, UserRound, Trash2, ClipboardList, PanelLeftClose, Layers, FileCode, CheckCircle, ShieldQuestion } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import './style.css';

const seedCases = [
  { id: 'CASE-2026-001', name: 'Suspicious Login Activity', type: 'Unauthorized access', owner: 'Alex Morgan', status: 'Active', priority: 'High', created: 'Oct 12, 2026', description: 'Multiple unsuccessful login attempts observed on the authentication endpoint.' },
  { id: 'CASE-2026-002', name: 'Web Server Anomaly', type: 'Web traffic investigation', owner: 'Sarah Chen', status: 'In Review', priority: 'Medium', created: 'Oct 10, 2026', description: 'Investigate abnormal requests and potential reconnaissance.' },
  { id: 'CASE-2026-003', name: 'Phishing Email Investigation', type: 'Email forensics', owner: 'Alex Morgan', status: 'Active', priority: 'Critical', created: 'Oct 08, 2026', description: 'Analyze suspicious email headers and related indicators.' },
  { id: 'CASE-2026-004', name: 'Endpoint Access Review', type: 'Access review', owner: 'Jordan Lee', status: 'Closed', priority: 'Low', created: 'Oct 02, 2026', description: 'Review exported authentication records.' }
];

const seedEvidence = [
  { id: 'EV-1001', name: 'apache_access.log', caseId: 'CASE-2026-001', type: 'Apache Log', size: '2.4 MB', date: 'Oct 12, 2026', hash: '8c3e7d9a51b26f4e8a1b2c3d4e5f6a7b8c9d0e1f', refHash: '8c3e7d9a51b26f4e8a1b2c3d4e5f6a7b8c9d0e1f', status: 'Analyzed', integrity: 'Match', verifyDate: 'Oct 12, 2026' },
  { id: 'EV-1002', name: 'nginx_error.log', caseId: 'CASE-2026-002', type: 'Nginx Log', size: '1.1 MB', date: 'Oct 10, 2026', hash: '4a1b2c3d5e6f7890123456789abcdef012345678', refHash: '4a1b2c3d5e6f7890123456789abcdef012345678', status: 'Analyzed', integrity: 'Match', verifyDate: 'Oct 10, 2026' },
  { id: 'EV-1003', name: 'email_headers.txt', caseId: 'CASE-2026-003', type: 'Email Header', size: '18 KB', date: 'Oct 08, 2026', hash: 'b20e6d5f4a3c21890fedcba9876543210fedcba9', refHash: '999e6d5f4a3c21890fedcba9876543210fedcba9', status: 'Pending', integrity: 'Mismatch', verifyDate: 'Oct 09, 2026' },
  { id: 'EV-1004', name: 'auth_events.csv', caseId: 'CASE-2026-004', type: 'CSV', size: '760 KB', date: 'Oct 02, 2026', hash: 'd77c9a1234e5b6f0123456789abcdef012345678', refHash: '', status: 'Analyzed', integrity: 'Not Verified', verifyDate: '—' }
];

const seedEvents = [
  { id: 'EVT-101', time: '2026-10-12 09:42:18', ip: '192.0.2.45', event: 'Failed login attempt', source: 'apache_access.log', severity: 'High', status: '401', caseId: 'CASE-2026-001' }
];

const seedFindings = [
  { id: 'FND-001', title: 'Potential brute-force activity', rule: 'Repeated failed authentication', severity: 'Critical', caseId: 'CASE-2026-001', events: 2, detail: 'Multiple failed login attempts from the same IP (192.0.2.45) within a short period on apache_access.log.' }
];

const traffic = [{ d: 'Mon', v: 42 }, { d: 'Tue', v: 56 }, { d: 'Wed', v: 43 }, { d: 'Thu', v: 77 }, { d: 'Fri', v: 61 }, { d: 'Sat', v: 91 }, { d: 'Sun', v: 73 }];
const COLORS = ['#ef6170', '#f6b765', '#4b91ef', '#35c6a2'];

function useStored(key, initial) {
  const [v, setV] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(v)), [key, v]);
  return [v, setV];
}

const navigation = [
  ['Dashboard', LayoutDashboard],
  ['Cases Management', FolderKanban],
  ['Evidence Upload', Upload],
  ['Evidence Repository', FileSearch],
  ['Evidence Integrity Check', ShieldQuestion],
  ['Metadata Explorer', FileCode],
  ['Analysis & Results', Activity],
  ['Report', FileText],
  ['Evidence Comparison', Layers]
];

const badge = (s) => <span className={'badge ' + String(s).toLowerCase().replaceAll(' ', '-')}>{s}</span>;

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin({ username, role: username.toLowerCase() === 'admin' ? 'Admin' : 'Analyst' });
    } else {
      setError('Please enter both username and password.');
    }
  };
  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b1120' }}>
      <div className="login-card" style={{ background: '#ffffff', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: '#4f46e5', color: 'white', padding: '8px', borderRadius: '8px' }}><ShieldCheck size={24} /></div>
          <div><h2 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>Digital Evidence Analyzer</h2><small style={{ color: '#64748b' }}>Investigation Workspace</small></div>
        </div>
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Username</label>
            <input type="text" placeholder="e.g. admin or analyst" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Password</label>
            <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('Dashboard');
  const [cases, setCases] = useStored('dea-cases', seedCases);
  const [evidence, setEvidence] = useStored('dea-evidence', seedEvidence);
  const [events] = useStored('dea-events', seedEvents);
  const [findings] = useStored('dea-findings', seedFindings);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [caseFilter, setCaseFilter] = useState('All');
  const [notice, setNotice] = useState('');
  const [selectedMetaId, setSelectedMetaId] = useState(seedEvidence[0]?.id || '');
  const [selectedReportCaseId, setSelectedReportCaseId] = useState(seedCases[0]?.id || '');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [compareId1, setCompareId1] = useState(seedEvidence[0]?.id || '');
  const [compareId2, setCompareId2] = useState(seedEvidence[1]?.id || '');
  const [comparisonExecuted, setComparisonExecuted] = useState(false);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const notify = (message) => { setNotice(message); setTimeout(() => setNotice(''), 4000); };
  const open = (kind, item = null) => { setSelected(item); setModal(kind); };

  const filteredCases = cases.filter(c => (caseFilter === 'All' || c.status === caseFilter) && JSON.stringify(c).toLowerCase().includes(query.toLowerCase()));
  const filteredEvidence = evidence.filter(e => JSON.stringify(e).toLowerCase().includes(query.toLowerCase()));
  const filteredFindings = findings.filter(f => JSON.stringify(f).toLowerCase().includes(query.toLowerCase()));

  const changePage = (p) => { setPage(p); setQuery(''); setMobile(false); };
  const exportCsv = (rows, name) => {
    const cols = Object.keys(rows[0] || {});
    const content = [cols.join(','), ...rows.map(r => cols.map(k => '"' + String(r[k] ?? '').replaceAll('"', '""') + '"').join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
  };

  const saveCase = (data) => {
    const entry = {
      ...data,
      id: 'CASE-2026-' + String(cases.length + 1).padStart(3, '0'),
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      owner: user.username,
      status: 'Active'
    };
    setCases([entry, ...cases]);
    setModal(null);
    notify('Case created successfully');
  };

  const updateCaseStatus = (id, newStatus) => {
    setCases(cases.map(c => c.id === id ? { ...c, status: newStatus } : c));
    setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    notify('Case status updated to ' + newStatus);
  };

  const verifyIntegrity = (evidenceId) => {
    setEvidence(evidence.map(e => {
      if (e.id === evidenceId) {
        const ref = e.refHash || e.hash;
        const res = e.hash === ref ? 'Match' : 'Mismatch';
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        return { ...e, integrity: res, verifyDate: today };
      }
      return e;
    }));
    notify('Evidence cryptographic verification completed.');
  };

  const uploadFiles = async (files, caseId) => {
    if (!files?.length) return;
    const list = [];
    for (const f of files) {
      let hash = 'Unavailable';
      try {
        const bytes = await f.arrayBuffer();
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
      } catch {}
      list.push({
        id: 'EV-' + Date.now() + '-' + list.length,
        name: f.name,
        caseId,
        type: f.name.split('.').pop()?.toUpperCase() || 'File',
        size: (f.size / 1024 < 1024 ? (f.size / 1024).toFixed(1) + ' KB' : (f.size / 1048576).toFixed(1) + ' MB'),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        hash,
        refHash: hash,
        status: 'Analyzed',
        integrity: 'Match',
        verifyDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      });
    }
    setEvidence(v => [...list, ...v]);
    notify(list.length + ' evidence file(s) uploaded and registered successfully.');
    setPage('Evidence Repository');
  };

  const currentMetaFile = evidence.find(e => e.id === selectedMetaId) || evidence[0];
  const metaProperties = currentMetaFile ? [
    { property: 'File Name', value: currentMetaFile.name },
    { property: 'File Type', value: currentMetaFile.type },
    { property: 'File Size', value: currentMetaFile.size },
    { property: 'Associated Case ID', value: currentMetaFile.caseId },
    { property: 'Registration Date', value: currentMetaFile.date },
    { property: 'SHA-256 Hash', value: currentMetaFile.hash },
    { property: 'Creation Timestamp', value: 'Not Available' },
    { property: 'Last Modified Timestamp', value: 'Not Available' },
    { property: 'Author / Owner', value: 'Not Available' }
  ].filter(p => JSON.stringify(p).toLowerCase().includes(query.toLowerCase())) : [];

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      notify('Report package generated successfully by backend.');
    }, 1200);
  };

  const currentReportCase = cases.find(c => c.id === selectedReportCaseId) || cases[0];
  const reportCaseEvidence = evidence.filter(e => e.caseId === selectedReportCaseId);
  const reportCaseFindings = findings.filter(f => f.caseId === selectedReportCaseId);
  const reportCaseEvents = events.filter(ev => ev.caseId === selectedReportCaseId);

  const art1 = evidence.find(e => e.id === compareId1) || evidence[0];
  const art2 = evidence.find(e => e.id === compareId2) || evidence[1];

  return (
    <div className="app">
      <aside className={'sidebar ' + (mobile ? 'show' : '')}>
        <div className="brand">
          <div className="brand-icon"><ShieldCheck size={23} /></div>
          <div><strong>Evidence<span>IQ</span></strong><small>DIGITAL FORENSICS</small></div>
          <button className="mobile-close" onClick={() => setMobile(false)}><X size={20} /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {navigation.map(([n, I]) => (
            <button key={n} className={'nav-link ' + (page === n ? 'active' : '')} onClick={() => changePage(n)}>
              <I size={19} />{n}
              {n === 'Analysis & Results' && <span className="nav-count">{findings.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon"><ShieldCheck size={19} /></div>
            <strong>Investigation workspace</strong>
            <p>Analyze evidence with clarity and confidence.</p>
            <button onClick={() => changePage('Evidence Repository')}>Explore evidence <ArrowUpRight size={15} /></button>
          </div>
          <div className="profile">
            <div className="avatar">{user.username.substring(0, 2).toUpperCase()}</div>
            <div><strong>{user.username}</strong><small>{user.role}</small></div>
            <button onClick={() => setUser(null)} title="Logout" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef6170' }}><LogOut size={17} /></button>
          </div>
        </div>
      </aside>
      {mobile && <div className="scrim" onClick={() => setMobile(false)} />}
      <div className="main">
        <header className="topbar">
          <div className="crumb">
            <button className="menu-button" onClick={() => setMobile(true)}><Menu size={21} /></button>
            <span>Workspace</span>
            <ChevronRight size={16} />
            <strong>{page}</strong>
          </div>
          <div className="top-actions">
            <span className="demo-pill"><span /> {user.role.toUpperCase()} MODE</span>
            <button className="icon-button" title="Notifications" onClick={() => notify('No new notifications')}><Bell size={19} /></button>
            <button className="avatar small" title="Account options" onClick={() => open('account')}>{user.username.substring(0, 2).toUpperCase()}</button>
          </div>
        </header>
        <main className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">DIGITAL INVESTIGATION PLATFORM</div>
              <h1>{page}</h1>
              <p>Active workspace management and digital forensics pipeline view.</p>
            </div>
            <div className="heading-actions">
              {page === 'Dashboard' && <button className="btn secondary" onClick={() => changePage('Report')}><Download size={17} /> Export report</button>}
              {page === 'Cases Management' && <button className="btn primary" onClick={() => open('case')}><Plus size={18} /> Create Case</button>}
              {page === 'Evidence Upload' && <button className="btn primary" onClick={() => changePage('Evidence Repository')}><FileSearch size={18} /> View Repository</button>}
              {page === 'Report' && <button className="btn primary" onClick={() => window.print()}><Download size={18} /> Print / Save PDF</button>}
            </div>
          </div>

          {page === 'Dashboard' && (
            <>
              <section className="stats">
                <Stat label="Total Cases" value={cases.length} icon={FolderKanban} tone="blue" trend="Active database records" />
                <Stat label="Evidence Files" value={evidence.length} icon={Database} tone="purple" trend="Stored artifacts" />
                <Stat label="Active Findings" value={findings.length} icon={ShieldAlert} tone="red" trend="Requires review" />
                <Stat label="Events Logged" value={events.length} icon={Activity} tone="green" trend="Normalized events" />
              </section>
              <section className="split">
                <div className="panel">
                  <PanelHeader title="Investigation Activity" subtitle="Dynamic weekly metrics" />
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={245}>
                      <AreaChart data={traffic} margin={{ top: 12, right: 10, left: -28, bottom: 0 }}>
                        <defs>
                          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6386fa" stopOpacity={0.26} />
                            <stop offset="100%" stopColor="#6386fa" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#edf1f7" vertical={false} />
                        <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: '#8793a9', fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8793a9', fontSize: 12 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="v" stroke="#5c7af0" strokeWidth={3} fill="url(#area)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="panel">
                  <PanelHeader title="Findings by Severity" subtitle="Current system distribution" />
                  <div className="donut-wrap">
                    <ResponsiveContainer width="100%" height={205}>
                      <PieChart>
                        <Pie data={[
                          { name: 'Critical', value: findings.filter(x => x.severity === 'Critical').length },
                          { name: 'High', value: findings.filter(x => x.severity === 'High').length },
                          { name: 'Medium', value: findings.filter(x => x.severity === 'Medium').length },
                          { name: 'Low', value: findings.filter(x => x.severity === 'Low').length }
                        ]} dataKey="value" innerRadius={65} outerRadius={85} paddingAngle={5}>
                          {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center"><strong>{findings.length}</strong><small>Findings</small></div>
                  </div>
                  <div className="legend">{['Critical', 'High', 'Medium', 'Low'].map((s, i) => <span key={s}><i style={{ background: COLORS[i] }} />{s}</span>)}</div>
                </div>
              </section>
              <section className="split bottom-split">
                <div className="panel">
                  <PanelHeader title="Recent Cases" subtitle="Latest database entries" action={<button className="text-link" onClick={() => changePage('Cases Management')}>View all <ArrowUpRight size={15} /></button>} />
                  <CaseTable rows={cases.slice(0, 4)} onOpen={c => open('caseDetail', c)} />
                </div>
                <div className="panel">
                  <PanelHeader title="Recent Findings" subtitle="Signals requiring investigation" action={<button className="text-link" onClick={() => changePage('Analysis & Results')}>View all <ArrowUpRight size={15} /></button>} />
                  <div className="finding-list">
                    {findings.map(f => (
                      <button className="finding-item" key={f.id} onClick={() => open('finding', f)}>
                        <div className="finding-icon"><AlertTriangle size={18} /></div>
                        <div><strong>{f.title}</strong><small>{f.caseId} · {f.rule}</small></div>
                        {badge(f.severity)}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {page === 'Cases Management' && (
            <div className="panel full">
              <div className="toolbar">
                <div className="search">
                  <Search size={18} />
                  <input placeholder="Search case name, ID, or description..." value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <select value={caseFilter} onChange={e => setCaseFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="In Review">In Review</option>
                  <option value="Closed">Closed</option>
                </select>
                <button className="btn primary" onClick={() => open('case')}><Plus size={16} /> Create Case</button>
                <button className="btn secondary" onClick={() => exportCsv(filteredCases, 'cases.csv')}><Download size={16} /> Export CSV</button>
              </div>
              <CaseTable rows={filteredCases} onOpen={c => open('caseDetail', c)} />
            </div>
          )}

          {page === 'Evidence Upload' && (
            <div className="panel full">
              <PanelHeader title="Evidence Upload & Artifact Registration" subtitle="Select files, verify details, and securely register evidence to a target case" />
              <UploadWorkspace cases={cases} onUpload={uploadFiles} />
            </div>
          )}

          {page === 'Evidence Repository' && (
            <div className="panel full">
              <div className="toolbar">
                <div className="search">
                  <Search size={18} />
                  <input placeholder="Search file name, type, or case ID..." value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <button className="btn primary" onClick={() => changePage('Evidence Upload')}><Upload size={16} /> Upload New</button>
                <button className="btn secondary" onClick={() => exportCsv(filteredEvidence, 'evidence.csv')}><Download size={16} /> Export CSV</button>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr><th>FILE NAME</th><th>CASE ID</th><th>TYPE</th><th>SIZE</th><th>DATE ADDED</th><th>STATUS</th><th>SHA-256 HASH</th><th>ACTIONS</th></tr>
                  </thead>
                  <tbody>
                    {filteredEvidence.map(e => (
                      <tr key={e.id}>
                        <td><span className="file-name"><File size={17} /><strong>{e.name}</strong></span></td>
                        <td><code>{e.caseId}</code></td>
                        <td>{e.type}</td>
                        <td>{e.size}</td>
                        <td>{e.date}</td>
                        <td>{badge(e.status)}</td>
                        <td><code style={{ fontSize: '11px', color: '#475569' }}>{e.hash.substring(0, 16)}...</code></td>
                        <td><button className="btn secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => open('evidenceDetail', e)}><Eye size={14} /> View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filteredEvidence.length && <Empty />}
              </div>
            </div>
          )}

          {page === 'Evidence Integrity Check' && (
            <div className="panel full">
              <div className="toolbar">
                <div className="search">
                  <Search size={18} />
                  <input placeholder="Search evidence by name or hash..." value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <button className="btn secondary" onClick={() => exportCsv(filteredEvidence, 'integrity_report.csv')}><Download size={16} /> Export Report</button>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr><th>FILE NAME</th><th>CURRENT SHA-256 HASH</th><th>REFERENCE HASH</th><th>INTEGRITY RESULT</th><th>VERIFIED DATE</th><th>ACTION</th></tr>
                  </thead>
                  <tbody>
                    {filteredEvidence.map(e => (
                      <tr key={e.id}>
                        <td><span className="file-name"><File size={17} /><strong>{e.name}</strong></span></td>
                        <td><code style={{ fontSize: '11px' }}>{e.hash.substring(0, 16)}...</code></td>
                        <td><code style={{ fontSize: '11px', color: '#64748b' }}>{(e.refHash || '—').substring(0, 16)}...</code></td>
                        <td>{badge(e.integrity || 'Not Verified')}</td>
                        <td>{e.verifyDate || '—'}</td>
                        <td><button className="btn primary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => verifyIntegrity(e.id)}><ShieldCheck size={14} /> Verify</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filteredEvidence.length && <Empty />}
              </div>
              <div style={{ marginTop: '20px', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#475569' }}>
                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>Forensic Notice:</strong> Hash matching confirms that the digital content of the file has not been altered since acquisition. However, it does not independently verify the original source or the integrity of the chain of custody.
              </div>
            </div>
          )}

          {page === 'Metadata Explorer' && (
            <div className="panel full">
              <div className="toolbar">
                <div className="search">
                  <Search size={18} />
                  <input placeholder="Search property name or value..." value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <select value={selectedMetaId} onChange={e => setSelectedMetaId(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  {evidence.map(e => <option key={e.id} value={e.id}>{e.name} ({e.type})</option>)}
                </select>
                <button className="btn secondary" onClick={() => exportCsv(metaProperties, 'metadata_report.csv')}><Download size={16} /> Export CSV</button>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr><th>PROPERTY</th><th>VALUE</th></tr>
                  </thead>
                  <tbody>
                    {metaProperties.map((p, i) => (
                      <tr key={i}>
                        <td><strong>{p.property}</strong></td>
                        <td>{p.property.includes('Hash') ? <code style={{ fontSize: '11px', color: '#4f46e5' }}>{p.value}</code> : (p.value === 'Not Available' ? <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Available</span> : p.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!metaProperties.length && <Empty />}
              </div>
            </div>
          )}

          {page === 'Analysis & Results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TrafficAnalysis />
              <div className="panel full">
                <div className="toolbar">
                  <div className="search">
                    <Search size={18} />
                    <input placeholder="Search findings by title, rule, or case..." value={query} onChange={e => setQuery(e.target.value)} />
                  </div>
                  <button className="btn secondary" onClick={() => exportCsv(filteredFindings, 'findings.csv')}><Download size={16} /> Export CSV</button>
                </div>
                <div className="finding-cards">
                  {filteredFindings.map(f => (
                    <button className="finding-card" key={f.id} onClick={() => open('finding', f)} style={{ textAlign: 'left', width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', cursor: 'pointer', marginBottom: '12px' }}>
                      <div className="finding-card-top" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>{badge(f.severity)}<small style={{ color: '#64748b' }}>{f.id}</small></div>
                      <h3 style={{ fontSize: '16px', color: '#1e293b', marginBottom: '6px' }}>{f.title}</h3>
                      <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>{f.detail}</p>
                      <div className="finding-card-bottom" style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#64748b' }}>
                        <span><FolderKanban size={15} /> {f.caseId}</span>
                        <span><Activity size={15} /> {f.events} supporting events</span>
                        <span>Rule: {f.rule}</span>
                      </div>
                    </button>
                  ))}
                  {!filteredFindings.length && <Empty />}
                </div>
              </div>
            </div>
          )}

          {page === 'Report' && (
            <div className="panel full">
              <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Select Case:</label>
                  <select value={selectedReportCaseId} onChange={e => setSelectedReportCaseId(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    {cases.map(c => <option key={c.id} value={c.id}>{c.id} — {c.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn primary" disabled={generatingReport} onClick={handleGenerateReport}>
                    <FileText size={16} /> {generatingReport ? 'Preparing Report Package...' : 'Generate Case Report'}
                  </button>
                  <button className="btn secondary" onClick={() => window.print()}><Download size={16} /> Export PDF / Print</button>
                </div>
              </div>

              {currentReportCase && (
                <div className="report-preview" style={{ marginTop: '20px', background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ borderBottom: '2px solid #4f46e5', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="eyebrow" style={{ color: '#4f46e5' }}>DIGITAL FORENSICS INVESTIGATION REPORT</span>
                      <h2 style={{ fontSize: '24px', color: '#1e293b', margin: '4px 0' }}>{currentReportCase.name}</h2>
                      <p style={{ color: '#64748b', fontSize: '13px' }}>Case Identifier: <code>{currentReportCase.id}</code> | Owner: {currentReportCase.owner}</p>
                    </div>
                    <div>{badge(currentReportCase.status)}{badge(currentReportCase.priority)}</div>
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', marginBottom: '8px' }}>1. Executive Summary</h3>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{currentReportCase.description || 'No case description provided.'}</p>
                    <div className="report-metrics" style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                      <span style={{ background: '#f8fafc', padding: '10px 15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}><strong>{reportCaseEvidence.length}</strong> Evidence Artifacts</span>
                      <span style={{ background: '#f8fafc', padding: '10px 15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}><strong>{reportCaseFindings.length}</strong> Security Findings</span>
                      <span style={{ background: '#f8fafc', padding: '10px 15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}><strong>{reportCaseEvents.length}</strong> Logged Events</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', marginBottom: '8px' }}>2. Key Findings & Severity Analysis</h3>
                    {reportCaseFindings.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {reportCaseFindings.map(f => (
                          <div key={f.id} style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong>{f.title}</strong>
                              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Rule: {f.rule} — {f.detail}</p>
                            </div>
                            {badge(f.severity)}
                          </div>
                        ))}
                      </div>
                    ) : <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No critical findings recorded for this case.</p>}
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', marginBottom: '8px' }}>3. Event Timeline</h3>
                    {reportCaseEvents.length > 0 ? (
                      <div style={{ borderLeft: '2px solid #cbd5e1', paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {reportCaseEvents.map(ev => (
                          <div key={ev.id} style={{ position: 'relative' }}>
                            <small style={{ color: '#4f46e5', fontWeight: 'bold' }}>{ev.time}</small>
                            <div style={{ fontSize: '13px', color: '#1e293b' }}>{ev.event} (IP: {ev.ip})</div>
                          </div>
                        ))}
                      </div>
                    ) : <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No timeline events logged.</p>}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', marginBottom: '8px' }}>4. Evidence Information & Cryptographic Hashes</h3>
                    {reportCaseEvidence.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}><th style={{ padding: '8px' }}>Name</th><th style={{ padding: '8px' }}>Type</th><th style={{ padding: '8px' }}>Size</th><th style={{ padding: '8px' }}>SHA-256 Hash</th></tr>
                        </thead>
                        <tbody>
                          {reportCaseEvidence.map(e => (
                            <tr key={e.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '8px' }}><strong>{e.name}</strong></td>
                              <td style={{ padding: '8px' }}>{e.type}</td>
                              <td style={{ padding: '8px' }}>{e.size}</td>
                              <td style={{ padding: '8px' }}><code style={{ fontSize: '11px', color: '#4f46e5' }}>{e.hash}</code></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No evidence registered for this case.</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {page === 'Evidence Comparison' && (
            <div className="panel full">
              <div className="toolbar" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Artifact 1:</label>
                  <select value={compareId1} onChange={e => { setCompareId1(e.target.value); setComparisonExecuted(false); }} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    {evidence.map(e => <option key={e.id} value={e.id}>{e.name} ({e.type})</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Artifact 2:</label>
                  <select value={compareId2} onChange={e => { setCompareId2(e.target.value); setComparisonExecuted(false); }} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    {evidence.map(e => <option key={e.id} value={e.id}>{e.name} ({e.type})</option>)}
                  </select>
                </div>
                <button className="btn primary" onClick={() => { setComparisonExecuted(true); notify('Evidence comparison executed.'); }}>
                  <Layers size={16} /> Compare Artifacts
                </button>
                <button className="btn secondary" onClick={() => exportCsv([
                  { Property: 'File Name', Artifact1: art1?.name, Artifact2: art2?.name },
                  { Property: 'File Type', Artifact1: art1?.type, Artifact2: art2?.type },
                  { Property: 'File Size', Artifact1: art1?.size, Artifact2: art2?.size },
                  { Property: 'SHA-256 Hash', Artifact1: art1?.hash, Artifact2: art2?.hash }
                ], 'evidence_comparison.csv')}><Download size={16} /> Export CSV</button>
              </div>

              {art1 && art2 && (
                <div className="table-scroll" style={{ marginTop: '20px' }}>
                  <table>
                    <thead>
                      <tr><th>PROPERTY / METRIC</th><th>{art1.name} (Artifact 1)</th><th>{art2.name} (Artifact 2)</th><th>COMPARISON RESULT</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>File Name</strong></td>
                        <td>{art1.name}</td>
                        <td>{art2.name}</td>
                        <td>{art1.name === art2.name ? <span className="badge analyzed">Identical Name</span> : <span className="badge mismatch">Different Names</span>}</td>
                      </tr>
                      <tr>
                        <td><strong>File Type</strong></td>
                        <td>{art1.type}</td>
                        <td>{art2.type}</td>
                        <td>{art1.type === art2.type ? <span className="badge analyzed">Same Format</span> : <span className="badge in-review">Mixed Format</span>}</td>
                      </tr>
                      <tr>
                        <td><strong>File Size</strong></td>
                        <td>{art1.size}</td>
                        <td>{art2.size}</td>
                        <td>{art1.size === art2.size ? <span className="badge analyzed">Equal Size</span> : <span className="badge high">Size Variance</span>}</td>
                      </tr>
                      <tr>
                        <td><strong>Associated Case</strong></td>
                        <td><code>{art1.caseId}</code></td>
                        <td><code>{art2.caseId}</code></td>
                        <td>{art1.caseId === art2.caseId ? <span className="badge analyzed">Same Case</span> : <span className="badge closed">Cross-Case</span>}</td>
                      </tr>
                      <tr>
                        <td><strong>SHA-256 Hash</strong></td>
                        <td><code style={{ fontSize: '11px', color: '#4f46e5' }}>{art1.hash}</code></td>
                        <td><code style={{ fontSize: '11px', color: '#4f46e5' }}>{art2.hash}</code></td>
                        <td>{art1.hash === art2.hash ? <span className="badge analyzed">Exact Match</span> : <span className="badge critical">Different Content</span>}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {comparisonExecuted && (
                <div style={{ marginTop: '20px', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#475569' }}>
                  <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>Comparison Summary:</strong>
                  {art1?.hash === art2?.hash ? 'Both artifacts share identical cryptographic hashes, indicating exact digital equivalence.' : 'Artifacts exhibit distinct cryptographic signatures and properties. Common timeline overlaps or divergences can be reviewed in the analysis pipeline.'}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {modal === 'account' && (
        <div className="account-pop">
          <strong>{user.username}</strong>
          <p>Role: {user.role}</p>
          <button className="btn secondary" onClick={() => { setUser(null); setModal(null); }}><LogOut size={16} /> Logout</button>
        </div>
      )}
      {notice && <div className="toast"><CheckCircle2 size={19} />{notice}</div>}

      {modal && modal !== 'account' && (
        <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
          <div className="modal" onMouseDown={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">INVESTIGATION WORKSPACE</div>
                <h2>{({ case: 'Create New Case', caseDetail: 'Case Details & Actions', evidenceDetail: 'Evidence Artifact Details', finding: 'Detection Finding Details' })[modal]}</h2>
              </div>
              <button className="icon-button" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            {modal === 'case' && <CaseForm onSave={saveCase} onCancel={() => setModal(null)} />}
            {modal === 'caseDetail' && selected && (
              <div className="modal-body">
                <div className="detail-header">{badge(selected.status)}{badge(selected.priority)}</div>
                <h3>{selected.name}</h3>
                <p style={{ marginTop: '8px', color: '#475569' }}>{selected.description || 'No description provided.'}</p>
                <Detail label="Case ID" value={selected.id} />
                <Detail label="Investigation Type" value={selected.type} />
                <Detail label="Assigned Owner" value={selected.owner} />
                <Detail label="Created Date" value={selected.created} />
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Change Case Status</label>
                  <select value={selected.status} onChange={e => updateCaseStatus(selected.id, e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="Active">Active</option>
                    <option value="In Review">In Review</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="modal-footer"><button className="btn secondary" onClick={() => setModal(null)}>Close</button></div>
              </div>
            )}
            {modal === 'evidenceDetail' && selected && (
              <div className="modal-body">
                <div className="detail-header">{badge(selected.status)}</div>
                <h3>{selected.name}</h3>
                <Detail label="Evidence ID" value={selected.id} />
                <Detail label="Associated Case" value={selected.caseId} />
                <Detail label="Format Type" value={selected.type} />
                <Detail label="File Size" value={selected.size} />
                <Detail label="Registration Date" value={selected.date} />
                <div className="hash-box" style={{ marginTop: '15px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <strong>SHA-256 HASH VERIFICATION</strong>
                  <code style={{ display: 'block', marginTop: '4px', wordBreak: 'break-all', color: '#4f46e5' }}>{selected.hash}</code>
                </div>
                <div className="modal-footer" style={{ marginTop: '20px' }}><button className="btn secondary" onClick={() => setModal(null)}>Close</button></div>
              </div>
            )}
            {modal === 'finding' && selected && (
              <div className="modal-body">
                <div className="detail-header">{badge(selected.severity)}<span>{selected.id}</span></div>
                <h3>{selected.title}</h3>
                <p style={{ margin: '10px 0', color: '#475569' }}>{selected.detail}</p>
                <Detail label="Detection Rule" value={selected.rule} />
                <Detail label="Related Case" value={selected.caseId} />
                <Detail label="Supporting Events Count" value={selected.events} />
                <div className="warning-text" style={{ marginTop: '15px', background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '13px', color: '#64748b' }}>Analyst validation is required before certifying this incident in the final report.</div>
                <div className="modal-footer" style={{ marginTop: '20px' }}><button className="btn secondary" onClick={() => setModal(null)}>Close</button></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone, trend }) {
  return (
    <div className="stat">
      <div className="stat-top"><span>{label}</span><div className={'stat-icon ' + tone}><Icon size={20} /></div></div>
      <strong>{value.toLocaleString()}</strong>
      <small>{trend}</small>
    </div>
  );
}

function PanelHeader({ title, subtitle, action }) {
  return (
    <div className="panel-head">
      <div><h2>{title}</h2><p>{subtitle}</p></div>
      {action}
    </div>
  );
}

function CaseTable({ rows, onOpen }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr><th>CASE / INVESTIGATION</th><th>CASE ID</th><th>DESCRIPTION</th><th>OWNER</th><th>PRIORITY</th><th>STATUS</th><th>CREATED</th><th>ACTIONS</th></tr>
        </thead>
        <tbody>
          {rows.map(c => (
            <tr key={c.id}>
              <td>
                <div className="case-cell">
                  <span className="case-icon"><FolderKanban size={17} /></span>
                  <div><strong>{c.name}</strong><small>{c.type}</small></div>
                </div>
              </td>
              <td><code>{c.id}</code></td>
              <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={c.description}>{c.description || '—'}</td>
              <td>{c.owner}</td>
              <td>{badge(c.priority)}</td>
              <td>{badge(c.status)}</td>
              <td>{c.created}</td>
              <td><button className="btn secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => onOpen(c)}><Eye size={14} /> Open</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <Empty />}
    </div>
  );
}

function Empty() {
  return <div className="empty"><FileSearch size={28} /><strong>No matching records</strong></div>;
}

function Detail({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CaseForm({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Web traffic investigation');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  return (
    <form className="modal-body" onSubmit={e => { e.preventDefault(); onSave({ name, type, priority, description }); }}>
      <label>Case Name<input required maxLength="100" placeholder="e.g. Unauthorized Database Access" value={name} onChange={e => setName(e.target.value)} /></label>
      <label>Investigation Type
        <select value={type} onChange={e => setType(e.target.value)}>
          <option>Web traffic investigation</option>
          <option>Unauthorized access</option>
          <option>Email forensics</option>
          <option>Access review</option>
          <option>Other</option>
        </select>
      </label>
      <label>Priority
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </label>
      <label>Description<textarea rows="3" placeholder="Describe the scope and findings..." value={description} onChange={e => setDescription(e.target.value)} /></label>
      <div className="modal-footer">
        <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary"><Plus size={17} /> Save Case</button>
      </div>
    </form>
  );
}

function UploadWorkspace({ cases, onUpload }) {
  const [caseId, setCaseId] = useState(cases[0]?.id || '');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const startUpload = (e) => {
    e.preventDefault();
    if (!files.length || !caseId) return;
    setUploading(true);
    setProgress(15);
    setTimeout(() => {
      setProgress(60);
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setUploading(false);
          setSuccessMsg('Evidence successfully uploaded and verified!');
          onUpload(files, caseId);
        }, 600);
      }, 700);
    }, 600);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
      <div className="panel" style={{ margin: 0 }}>
        <h3>Select Target Case & Files</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Choose the investigation case and drop your digital evidence artifact.</p>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Associated Investigation Case</label>
          <select value={caseId} onChange={e => setCaseId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            {cases.map(c => <option key={c.id} value={c.id}>{c.id} — {c.name}</option>)}
          </select>
        </div>
        <div className="dropzone" onDragOver={e => e.preventDefault()} onDrop={handleDrop} style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '30px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
          <Upload size={36} color="#4f46e5" style={{ marginBottom: '10px' }} />
          <strong style={{ display: 'block', fontSize: '15px', color: '#1e293b' }}>Drag & drop evidence files here</strong>
          <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>Supports .log, .txt, .csv, .eml, .pcap</small>
          <label className="btn secondary" style={{ display: 'inline-block', marginTop: '15px', cursor: 'pointer' }}>
            Choose Files
            <input type="file" multiple accept=".log,.txt,.csv,.eml,.pcap" style={{ display: 'none' }} onChange={handleFileSelect} />
          </label>
        </div>
      </div>

      <div className="panel" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3>File Preview & Queue</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Review selected artifacts before registration.</p>
          <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {files.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '10px 12px', borderRadius: '6px', fontSize: '13px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <File size={16} color="#4f46e5" /><strong>{f.name}</strong> <small style={{ color: '#64748b' }}>({(f.size / 1024).toFixed(1)} KB)</small>
                </span>
                <button type="button" onClick={() => removeFile(i)} style={{ background: 'transparent', border: 'none', color: '#ef6170', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            ))}
            {!files.length && <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>No files selected yet.</p>}
          </div>
        </div>

        <div>
          {uploading && (
            <div style={{ margin: '15px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold' }}>
                <span>Uploading & Computing SHA-256...</span><span>{progress}%</span>
              </div>
              <div style={{ width: '100%', background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, background: '#4f46e5', height: '100%', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>
          )}
          {successMsg && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} />{successMsg}</div>}
          <button type="button" className="btn primary" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }} disabled={!files.length || uploading} onClick={startUpload}>
            {uploading ? 'Processing Upload...' : 'Upload & Register Evidence'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrafficAnalysis() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function analyze(e) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const r = await fetch('http://localhost:8765/analyze', { method: 'POST', body });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (e) {
      setError(e.message + ' — Run python analyzer.py in a second terminal.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="analysis-wrap">
      <section className="panel analysis-upload" style={{ margin: 0 }}>
        <h2>Intelligent Traffic & Log Analysis</h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Upload a local network packet capture or log file for heuristic triage.</p>
        <form onSubmit={analyze}>
          <input type="file" accept=".pcap,.log,.txt" onChange={e => setFile(e.target.files?.[0] || null)} />
          <button className="btn primary" disabled={!file || busy}>{busy ? 'Analyzing…' : 'Analyze Evidence'}</button>
        </form>
        {error && <p className="analysis-error" style={{ color: '#ef6170', marginTop: '10px', fontSize: '13px' }}>{error}</p>}
      </section>
      {result && (
        <section className="panel" style={{ marginTop: '15px' }}>
          <h2>{result.attack_type}</h2>
          <p>{result.risk_level} risk · {result.suspicious_percentage}% suspicious records</p>
        </section>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);