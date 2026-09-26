import { useEffect, useMemo, useState } from 'react';
import { firebaseConfigured, getFirebase } from './firebase.js';

const demoResponders = [
  { id: 'sofie', name: 'Sofie Peeters', initials: 'SP', location: 'Hulppost Centrum · EHBO', status: 'Beschikbaar' },
  { id: 'youssef', name: 'Youssef El Amrani', initials: 'YA', location: 'Team Alfa · onderweg', status: 'Interventie' },
  { id: 'lotte', name: 'Lotte Maes', initials: 'LM', location: 'Hulppost Spoor Noord · EHBO', status: 'Beschikbaar' },
  { id: 'pieter', name: 'Pieter Janssens', initials: 'PJ', location: 'Team Bravo · laatste update 14 min', status: 'Opvolgen' },
  { id: 'noor', name: 'Noor De Smet', initials: 'ND', location: 'Team Alfa · onderweg', status: 'Interventie' },
];

const demoInterventions = [
  { id: 'INT-2048', title: 'Eerste hulp gevraagd', place: 'Spoor Noord · zone B', team: 'Team Alfa · 2 hulpverleners', status: 'Onderweg', updated: '14:31' },
  { id: 'INT-2047', title: 'EHBO-post ondersteuning', place: 'Italiëlei · ingang west', team: 'Sofie Peeters', status: 'Ter plaatse', updated: '14:27' },
  { id: 'INT-2046', title: 'Medische bijstand', place: 'Noorderlaan · terrein 4', team: 'Team Bravo · 2 hulpverleners', status: 'Opvolgen', updated: '14:18' },
  { id: 'INT-2045', title: 'Overdracht aan ambulance', place: 'Hulppost Centrum', team: 'Lotte Maes', status: 'Afgerond', updated: '14:02' },
];

function statusClass(status) {
  if (['Interventie', 'Onderweg', 'Nieuw'].includes(status)) return 'busy';
  if (status === 'Opvolgen') return 'warn';
  return '';
}

function Status({ children }) {
  return <span className={`status ${statusClass(children)}`}>{children}</span>;
}

function MapPanel({ onSelect }) {
  const [zoom, setZoom] = useState(1);
  const tags = [
    ['m1', '', 'Sofie Peeters', '✚', 'Hulppost · 1 min'],
    ['m2', ' busy', 'Team Alfa', '↗', 'Onderweg · 4 min'],
    ['m3', '', 'Lotte Maes', '✚', 'Hulppost · 2 min'],
    ['m4', ' warn', 'Team Bravo', '…', 'Status controleren'],
    ['m5', '', 'Hulppost 03', '⌂', 'Spoornoord'],
  ];
  return (
    <section className="card">
      <div className="cardhead">
        <div><div className="cardtitle">Live inzetkaart</div><div className="card-sub">Teamlocaties en posten · demo-terrein Antwerpen</div></div>
        <div className="maptools">
          <button className="iconbtn" aria-label="Inzoomen" onClick={() => setZoom((value) => Math.min(1.35, value + 0.08))}>＋</button>
          <button className="iconbtn" aria-label="Uitzoomen" onClick={() => setZoom((value) => Math.max(0.9, value - 0.08))}>−</button>
          <button className="iconbtn" aria-label="Kaart opnieuw centreren" onClick={() => setZoom(1)}>⌖</button>
        </div>
      </div>
      <div className="mapwrap">
        <svg className="map" style={{ transform: `scale(${zoom})` }} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-label="Schematische kaart van het evenemententerrein">
          <rect width="800" height="400" className="mapbg" />
          <path className="water" d="M0 43 Q135 15 192 68T354 42L405 0H0ZM800 345Q668 325 604 354T442 400H800Z" />
          <path className="park" d="M500 35h150v90H500zM50 265h130v95H50zM635 255h110v70H635z" />
          <g><path className="block" d="M75 95h105v53H75zM210 83h92v67h-92zM344 84h100v49h-100zM93 178h82v52H93zM216 183h133v40H216zM390 167h95v61h-95zM540 165h120v57H540zM185 280h112v57H185zM345 275h110v58H345zM475 290h100v48H475zM690 104h74v100h-74z" /></g>
          <path className="road" d="M0 158C150 150 171 162 270 156S466 152 580 159 724 154 800 161M316 0c0 70 4 94-2 157s1 153 4 243M515 0c-4 72 5 112 0 162s8 138 12 238M0 247c103-5 185 5 271 0s152-1 249 5 190 0 280-8" />
          <path className="road2" d="M0 158C150 150 171 162 270 156S466 152 580 159 724 154 800 161M316 0c0 70 4 94-2 157s1 153 4 243M515 0c-4 72 5 112 0 162s8 138 12 238M0 247c103-5 185 5 271 0s152-1 249 5 190 0 280-8" />
          <path className="minor" d="M90 70l104 70M432 45l60 77M590 238l120 78M102 243l99 111M610 55l-53 87M240 230l45 80" />
          <text x="250" y="34" className="street">NOORDERLAAN</text><text x="10" y="147" className="street">ITALIËLEI</text><text x="325" y="382" className="street">FRANKRIJKLEI</text><text x="712" y="149" className="street">LEIEN</text><text x="533" y="24" className="place">SPOOR NOORD</text><text x="74" y="291" className="place">CENTRUM</text><text x="659" y="282" className="place">HULPPOST 03</text>
          <circle cx="402" cy="199" r="23" fill="#c92e3b" opacity=".12" /><circle cx="402" cy="199" r="8" fill="#c92e3b" stroke="white" strokeWidth="3" />
        </svg>
        {tags.map(([position, kind, name, icon, detail]) => <button key={name} className={`maptag ${position}${kind}`} onClick={() => onSelect(`${name} · demo-status geselecteerd`)}><span className="pin">{icon}</span><span>{name}<small>{detail}</small></span></button>)}
        <div className="maplegend"><span className="legenditem"><i className="legenddot" /> Beschikbaar</span><span className="legenditem"><i className="legenddot busy" /> Interventie</span><span className="legenditem"><i className="legenddot warn" /> Opvolgen</span></div>
        <div className="mapnote">Schematische demo-kaart · geen live locatie</div>
      </div>
    </section>
  );
}

function NewInterventionModal({ onClose, onSave }) {
  const [place, setPlace] = useState('');
  const [kind, setKind] = useState('Eerste hulp gevraagd');
  const [team, setTeam] = useState('Team Alfa');
  function submit(event) {
    event.preventDefault();
    if (!place.trim()) return;
    onSave({ title: kind, place: place.trim(), team, status: 'Nieuw' });
  }
  return <div className="modalback open" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal" onSubmit={submit}>
    <h2>Nieuwe interventie</h2><p>Registreer een melding en wijs een beschikbaar team toe. Gebruik geen patiëntnamen of medische details in deze demo.</p>
    <label htmlFor="eventName">Type melding</label><select id="eventName" value={kind} onChange={(event) => setKind(event.target.value)}><option>Eerste hulp gevraagd</option><option>Medische bijstand</option><option>Ondersteuning hulppost</option><option>Logistieke ondersteuning</option></select>
    <label htmlFor="eventPlace">Locatie / zone</label><input id="eventPlace" value={place} onChange={(event) => setPlace(event.target.value)} placeholder="Bijv. Spoor Noord · zone B" required />
    <label htmlFor="eventTeam">Team toewijzen</label><select id="eventTeam" value={team} onChange={(event) => setTeam(event.target.value)}><option>Team Alfa</option><option>Team Bravo</option><option>Beschikbare hulpverlener</option></select>
    <div className="modalactions"><button type="button" className="btn" onClick={onClose}>Annuleren</button><button className="btn primary">Melding registreren</button></div>
  </form></div>;
}

function formatUpdated(item) {
  if (item.updated) return item.updated;
  const timestamp = item.updatedAt?.toDate?.() ?? item.createdAt?.toDate?.();
  return timestamp ? timestamp.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }) : 'Zojuist';
}

function InterventionDetails({ intervention, onClose, onStatusChange, canEdit }) {
  if (!intervention) return null;
  return <div className="modalback open" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal detail-modal" aria-labelledby="detail-title">
      <div className="detail-heading"><div><span className="eyebrow">{intervention.reference ?? intervention.id}</span><h2 id="detail-title">{intervention.title}</h2></div><button className="iconbtn" onClick={onClose} aria-label="Sluiten">×</button></div>
      <p>Operationele melding en toegewezen eenheid.</p>
      <div className="detail-grid"><div><span>Locatie / zone</span><b>{intervention.place || 'Niet opgegeven'}</b></div><div><span>Toegewezen team</span><b>{intervention.team || 'Nog niet toegewezen'}</b></div><div><span>Laatste update</span><b>{formatUpdated(intervention)}</b></div><div><span>Status</span>{canEdit ? <select value={intervention.status} onChange={(event) => onStatusChange(intervention, event.target.value)}><option>Nieuw</option><option>Onderweg</option><option>Ter plaatse</option><option>Opvolgen</option><option>Afgerond</option></select> : <Status>{intervention.status}</Status>}</div></div>
      <div className="modalactions"><button className="btn" onClick={onClose}>Sluiten</button></div>
    </section>
  </div>;
}

function InterventionsPage({ items, demoMode, onNew, onToast, canEdit, onStatusChange }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Alle statussen');
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => items.filter((item) => {
    const text = `${item.reference ?? item.id} ${item.title ?? ''} ${item.place ?? ''} ${item.team ?? ''}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (status === 'Alle statussen' || item.status === status);
  }), [items, search, status]);
  const openItems = items.filter((item) => item.status !== 'Afgerond');
  const counts = [
    ['Open meldingen', openItems.length, '↗'],
    ['Onderweg', items.filter((item) => item.status === 'Onderweg').length, '➜'],
    ['Opvolgen', items.filter((item) => item.status === 'Opvolgen').length, '◷'],
    ['Afgerond', items.filter((item) => item.status === 'Afgerond').length, '✓'],
  ];
  return <>
    <div className="intervention-summary">{counts.map(([label, count, icon]) => <div className="stat" key={label}><div className="stat-top">{label}<span className="stat-icon">{icon}</span></div><strong>{count}<small>{label === 'Open meldingen' ? 'actief' : 'interventies'}</small></strong></div>)}</div>
    <section className="card interventions-page-card">
      <div className="cardhead"><div><div className="cardtitle">Alle interventies</div><div className="card-sub">{demoMode ? 'Voorbeeldgegevens' : 'Realtime bijgewerkt vanuit Firebase'} · {filtered.length} resultaten</div></div><button className="btn primary" onClick={onNew}>＋ &nbsp; Nieuwe interventie</button></div>
      <div className="intervention-filters"><div className="search"><span>⌕</span><input aria-label="Zoek interventies" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Zoek op referentie, melding, locatie of team" /></div><select className="select" aria-label="Filter op status" value={status} onChange={(event) => setStatus(event.target.value)}><option>Alle statussen</option><option>Nieuw</option><option>Onderweg</option><option>Ter plaatse</option><option>Opvolgen</option><option>Afgerond</option></select></div>
      <div className="intervention-table-wrap"><table className="table"><thead><tr><th>Referentie</th><th>Melding</th><th>Locatie / zone</th><th>Team</th><th>Status</th><th>Update</th><th /></tr></thead><tbody>
        {filtered.map((item) => <tr key={item.id}><td className="id">{item.reference ?? item.id}</td><td className="event"><b>{item.title}</b></td><td className="teamcell">{item.place}</td><td className="teamcell">{item.team}</td><td><Status>{item.status}</Status></td><td className="updated">{formatUpdated(item)}</td><td><button className="detail detail-button" onClick={() => setSelected(item)}>Details →</button></td></tr>)}
        {filtered.length === 0 && <tr><td className="empty-state" colSpan="7">Geen interventies gevonden. Pas je zoekopdracht of filter aan.</td></tr>}
      </tbody></table></div>
    </section>
    {selected && <InterventionDetails intervention={selected} onClose={() => setSelected(null)} canEdit={canEdit} onStatusChange={(item, nextStatus) => { onStatusChange(item, nextStatus); setSelected({ ...item, status: nextStatus }); }} />}
  </>;
}

export default function App() {
  const [page, setPage] = useState('kaart');
  const [user, setUser] = useState(null);
  const [dispatcher, setDispatcher] = useState(false);
  const [firebase, setFirebase] = useState(null);
  const [responders, setResponders] = useState(demoResponders);
  const [interventions, setInterventions] = useState(demoInterventions);
  const [queryText, setQueryText] = useState('');
  const [filter, setFilter] = useState('Alle statussen');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const demoMode = !firebaseConfigured || !user || !dispatcher;

  useEffect(() => {
    if (!firebaseConfigured) return undefined;
    let cancelled = false;
    let unsubscribe = () => {};
    getFirebase().then((sdk) => {
      if (cancelled || !sdk) return;
      setFirebase(sdk);
      unsubscribe = sdk.onAuthStateChanged(sdk.auth, async (currentUser) => {
        setUser(currentUser);
        setDispatcher(false);
        if (!currentUser) return;
        const token = await sdk.getIdTokenResult(currentUser);
        if (sdk.auth.currentUser?.uid === currentUser.uid) setDispatcher(token.claims.dispatcher === true);
      });
    }).catch(() => showToast('Firebase kon niet worden geladen. Controleer de projectconfiguratie.'));
    return () => { cancelled = true; unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!firebase?.db || !user || !dispatcher) return undefined;
    const { db, collection, onSnapshot, orderBy, query } = firebase;
    const stopResponders = onSnapshot(collection(db, 'responders'), (snapshot) => {
      setResponders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, () => showToast('Geen toegang tot hulpverleners. Controleer dispatcher-toegang.'));
    const stopInterventions = onSnapshot(query(collection(db, 'interventions'), orderBy('createdAt', 'desc')), (snapshot) => {
      setInterventions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, () => showToast('Geen toegang tot interventies. Controleer dispatcher-toegang.'));
    return () => { stopResponders(); stopInterventions(); };
  }, [firebase, user, dispatcher]);

  function showToast(message) { setToast(message); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => setToast(''), 2600); }
  async function addIntervention(data) {
    const reference = `INT-${Date.now()}`;
    if (user && dispatcher && firebase?.db) {
      await firebase.addDoc(firebase.collection(firebase.db, 'interventions'), { ...data, reference, createdAt: firebase.serverTimestamp(), updatedAt: firebase.serverTimestamp(), createdBy: user.uid });
    } else {
      setInterventions((items) => [{ ...data, id: reference, reference, updated: 'Zojuist' }, ...items]);
    }
    setModalOpen(false);
    showToast(user && dispatcher ? 'Interventie opgeslagen in Firebase.' : 'Interventie toegevoegd aan demo-overzicht.');
  }
  async function updateInterventionStatus(item, status) {
    if (user && dispatcher && firebase?.db) {
      await firebase.updateDoc(firebase.doc(firebase.db, 'interventions', item.id), { status, updatedAt: firebase.serverTimestamp() });
    } else {
      setInterventions((items) => items.map((entry) => entry.id === item.id ? { ...entry, status, updated: 'Zojuist' } : entry));
    }
    showToast(`Status gewijzigd naar ${status}.`);
  }
  async function beginSignIn() {
    try {
      const sdk = firebase ?? await getFirebase();
      if (sdk) await sdk.signInWithPopup(sdk.auth, sdk.googleProvider);
    } catch {
      showToast('Aanmelden is mislukt. Controleer de Firebase Authentication-instellingen.');
    }
  }
  async function exportCsv() {
    const rows = [['Referentie', 'Interventie', 'Locatie', 'Team', 'Status'], ...interventions.map((item) => [item.reference ?? item.id, item.title, item.place, item.team, item.status])];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'interventies-overzicht.csv'; link.click(); URL.revokeObjectURL(url);
    showToast('Overzicht geëxporteerd als CSV.');
  }
  const filteredResponders = useMemo(() => responders.filter((person) => person.name?.toLowerCase().includes(queryText.toLowerCase()) && (filter === 'Alle statussen' || person.status === filter)), [responders, queryText, filter]);

  return <div className="shell">
    <aside className="sidebar"><div className="brand"><div className="brandmark">+</div><div className="brandname">RODE KRUIS<small>INZETCENTRALE</small></div></div>
      <div><div className="navlabel">Werkruimte</div><nav className="nav"><button aria-label="Inzetkaart" className={page === 'kaart' ? 'active' : ''} onClick={() => setPage('kaart')}><span className="ico">⌖</span><span>Inzetkaart</span></button><button aria-label="Interventies" className={page === 'interventies' ? 'active' : ''} onClick={() => setPage('interventies')}><span className="ico">▤</span><span>Interventies</span></button><button onClick={() => showToast('Hulpverleners · demo-weergave')}><span className="ico">♙</span><span>Hulpverleners</span></button><button onClick={() => showToast('Materiaal & tags · demo-weergave')}><span className="ico">▣</span><span>Materiaal & tags</span></button></nav></div>
      <div><div className="navlabel">Beheer</div><nav className="nav"><button onClick={() => showToast('Instellingen · demo-weergave')}><span className="ico">⚙</span><span>Instellingen</span></button></nav></div>
      <div className="sidebar-bottom"><div className="online"><span className="dot" /> Centrale verbonden</div>Rode Kruis Vlaanderen<br />{demoMode ? 'Demo-omgeving' : 'Firebase verbonden'}</div>
    </aside>
    <main className="main"><header className="topbar"><div className="crumb">Operaties&nbsp; / &nbsp;<b>{page === 'interventies' ? 'Interventies' : 'Inzetkaart'}</b></div><div className="topright"><div className="livepill"><span className="dot" /> {demoMode ? 'DEMO · voorbeeldgegevens' : 'FIREBASE · live verbonden'}</div>
      {user ? <button className="avatar" title="Afmelden" onClick={() => firebase?.signOut(firebase.auth)}>{user.displayName?.slice(0, 2).toUpperCase() ?? 'RK'}</button> : firebaseConfigured ? <button className="btn" onClick={beginSignIn}>Aanmelden</button> : <div className="avatar">CV</div>}</div></header>
      <div className="content"><div className="heading"><div><div className="eyebrow">Zaterdag 26 september 2026 · Antwerpen</div><h1>{page === 'interventies' ? 'Interventies' : 'Goedemorgen, dispatch'}</h1><p>{page === 'interventies' ? 'Bekijk, filter en volg de voortgang van alle meldingen.' : 'Volg de bezetting, interventies en beschikbare teams op één plek.'}</p></div><div className="actions">{page === 'interventies' && <button className="btn" onClick={exportCsv}>↓ &nbsp; Exporteer overzicht</button>}<button className="btn primary" onClick={() => setModalOpen(true)}>＋ &nbsp; Nieuwe interventie</button></div></div>
        {page === 'interventies' ? <InterventionsPage items={interventions} demoMode={demoMode} onNew={() => setModalOpen(true)} canEdit={user && dispatcher} onStatusChange={updateInterventionStatus} /> : <>
        <section className="stats"><div className="stat"><div className="stat-top">Actieve hulpverleners <span className="stat-icon">♙</span></div><strong>{responders.length}<small className="good">{responders.filter((item) => item.status === 'Beschikbaar').length} beschikbaar</small></strong></div><div className="stat"><div className="stat-top">Lopende interventies <span className="stat-icon">↗</span></div><strong>{interventions.filter((item) => item.status !== 'Afgerond').length}<small>2 teams onderweg</small></strong></div><div className="stat"><div className="stat-top">Hulpposten <span className="stat-icon">⌂</span></div><strong>3<small>Antwerpen regio</small></strong></div><div className="stat"><div className="stat-top">Materiaalstatus <span className="stat-icon">◉</span></div><strong>96%<small className="good">tags operationeel</small></strong></div></section>
        <section className="layout"><MapPanel onSelect={showToast} /><div><div className="card sidecard"><div className="cardhead"><div><div className="cardtitle">Teamoverzicht</div><div className="card-sub">{responders.length} hulpverleners ingepland</div></div><button className="iconbtn" aria-label="Meer opties" onClick={() => showToast('Teamopties · demo-weergave')}>•••</button></div>
          <div className="filterrow"><div className="search"><span>⌕</span><input value={queryText} onChange={(event) => setQueryText(event.target.value)} placeholder="Zoek een hulpverlener" /></div><select className="select" value={filter} onChange={(event) => setFilter(event.target.value)}><option>Alle statussen</option><option>Beschikbaar</option><option>Interventie</option><option>Opvolgen</option></select></div>
          <div className="teamlist">{filteredResponders.map((person) => <div className="person" key={person.id}><div className={`initials ${person.status === 'Interventie' ? 'red' : ''}`}>{person.initials ?? person.name?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="personinfo"><b>{person.name}</b><small>{person.location}</small></div><Status>{person.status}</Status></div>)}</div>
          <div className="teamfoot"><span>{demoMode ? 'Demo · geen actuele synchronisatie' : 'Realtime synchronisatie actief'}</span><button onClick={() => showToast('Alle ingeplande hulpverleners')}>Alle hulpverleners →</button></div></div>
          <div className="callout"><div className="callouticon">i</div><div><b>Locatie delen tijdens de inzet</b><br />Hulpverleners zien wanneer delen actief is. Locatie wordt enkel voor de actieve shift gebruikt en is na afloop niet langer zichtbaar.</div></div>
        </div></section>
        <section className="card interventions"><div className="cardhead"><div><div className="cardtitle">Actieve interventies</div><div className="card-sub">Operationele opvolging van meldingen en teams</div></div><div className="tabletools"><button className="btn" onClick={() => showToast('Filters voor interventies · demo-weergave')}>☷ &nbsp; Filter</button><button className="btn" onClick={() => showToast('Alle interventies')}>Alle interventies →</button></div></div>
          <table className="table"><thead><tr><th>Referentie</th><th>Interventie</th><th>Toegewezen team</th><th>Status</th><th>Laatste update</th><th /></tr></thead><tbody>{interventions.map((item) => <tr key={item.id}><td className="id">{item.id}</td><td className="event"><b>{item.title}</b><small>{item.place}</small></td><td className="teamcell">{item.team}</td><td><Status>{item.status}</Status></td><td className="updated">{item.updated ?? 'Zojuist'}</td><td className="detail" onClick={() => showToast(`${item.id} · demo-details`)}>Details →</td></tr>)}</tbody></table>
        </section></>}
      </div>
    </main>
    {modalOpen && <NewInterventionModal onClose={() => setModalOpen(false)} onSave={addIntervention} />}
    {user && !dispatcher && <div className="toast show">Account aangemeld; dispatcher-toegang ontbreekt.</div>}
    {toast && <div className="toast show" role="status">{toast}</div>}
  </div>;
}
