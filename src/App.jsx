import React, { useEffect, useMemo, useState } from 'react';
import {
  Wrench, Zap, Wind, Paintbrush, Sparkles, Hammer, Refrigerator,
  Search, MapPin, CalendarDays, Clock, Star, ShieldCheck, ArrowRight,
  Menu, X, CheckCircle2, ChevronDown, UserRound, ClipboardList,
  LayoutDashboard, Users, Settings, Plus, SlidersHorizontal, Phone,
  MessageCircle, CircleHelp, Home, Bell, LogOut, BadgeCheck, Wallet,
  TrendingUp, CalendarCheck, CircleCheck, XCircle
} from 'lucide-react';

const services = [
  { id: 'plumbing', name: 'Plumbing', detail: 'Leaks, taps & pipes', price: 299, icon: Wrench, color: 'mint' },
  { id: 'electrical', name: 'Electrician', detail: 'Wiring, lights & fans', price: 249, icon: Zap, color: 'yellow' },
  { id: 'ac', name: 'AC repair', detail: 'Service & installation', price: 499, icon: Wind, color: 'blue' },
  { id: 'cleaning', name: 'Cleaning', detail: 'Home & deep cleaning', price: 399, icon: Sparkles, color: 'pink' },
  { id: 'painting', name: 'Painting', detail: 'Walls & touch-ups', price: 599, icon: Paintbrush, color: 'peach' },
  { id: 'carpentry', name: 'Carpentry', detail: 'Doors, shelves & furniture', price: 349, icon: Hammer, color: 'lavender' },
  { id: 'appliance', name: 'Appliance repair', detail: 'Washing machine & fridge', price: 399, icon: Refrigerator, color: 'green' },
  { id: 'handyman', name: 'Home handyman', detail: 'Small jobs, fixed fast', price: 199, icon: Home, color: 'sand' },
];

const initialProviders = [
  { id: 1, name: 'Ravi Kumar', business: 'Ravi Home Services', skill: 'Plumbing', rating: 4.9, reviews: 218, distance: '1.2 km', experience: '8 years', price: 299, initials: 'RK', color: 'avatar-green', verified: true, jobs: 630 },
  { id: 2, name: 'Suresh Reddy', business: 'SR Electrical Works', skill: 'Electrician', rating: 4.8, reviews: 176, distance: '1.8 km', experience: '6 years', price: 249, initials: 'SR', color: 'avatar-blue', verified: true, jobs: 492 },
  { id: 3, name: 'Mohammed Imran', business: 'CoolCare AC Services', skill: 'AC repair', rating: 4.9, reviews: 143, distance: '2.4 km', experience: '7 years', price: 499, initials: 'MI', color: 'avatar-orange', verified: true, jobs: 410 },
  { id: 4, name: 'Lakshmi Devi', business: 'Sparkle Home Cleaning', skill: 'Cleaning', rating: 4.7, reviews: 97, distance: '2.1 km', experience: '5 years', price: 399, initials: 'LD', color: 'avatar-pink', verified: true, jobs: 284 },
  { id: 5, name: 'Kiran Babu', business: 'Kiran Carpentry', skill: 'Carpentry', rating: 4.8, reviews: 121, distance: '3.0 km', experience: '9 years', price: 349, initials: 'KB', color: 'avatar-purple', verified: true, jobs: 530 },
  { id: 6, name: 'Prasad Rao', business: 'Prasad Paint & Finish', skill: 'Painting', rating: 4.6, reviews: 84, distance: '3.5 km', experience: '4 years', price: 599, initials: 'PR', color: 'avatar-yellow', verified: false, jobs: 190 },
];

const seedBookings = [
  { id: 'HF-1024', service: 'AC repair', provider: 'Mohammed Imran', date: '2026-10-19', time: '10:00 AM', price: 499, status: 'Confirmed', address: 'Home address, Guntur', issue: 'AC not cooling properly' },
  { id: 'HF-1018', service: 'Plumbing', provider: 'Ravi Kumar', date: '2026-10-15', time: '04:30 PM', price: 299, status: 'Completed', address: 'Home address, Guntur', issue: 'Kitchen tap leaking' },
];

const currency = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;
const statusClass = (status) => status.toLowerCase().replaceAll(' ', '-');

function App() {
  const [page, setPage] = useState('home');
  const [search, setSearch] = useState('');
  const [activeService, setActiveService] = useState('All services');
  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('homefix-bookings')) || seedBookings; }
    catch { return seedBookings; }
  });
  const [providers, setProviders] = useState(initialProviders);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [bookingForm, setBookingForm] = useState({ service: 'Plumbing', date: '2026-10-19', time: '10:00 AM', address: '', issue: '' });
  const [showProfile, setShowProfile] = useState(false);
  const [adminTab, setAdminTab] = useState('Overview');

  useEffect(() => { localStorage.setItem('homefix-bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredProviders = useMemo(() => providers.filter(p => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || `${p.name} ${p.business} ${p.skill}`.toLowerCase().includes(q);
    const matchesService = activeService === 'All services' || p.skill.toLowerCase() === activeService.toLowerCase();
    return matchesSearch && matchesService;
  }), [providers, search, activeService]);

  const openBooking = (provider = null, serviceName = null) => {
    setSelectedProvider(provider);
    setBookingForm(f => ({ ...f, service: serviceName || provider?.skill || f.service, address: f.address || 'My home, Guntur', issue: '' }));
    setShowBooking(true);
  };

  const submitBooking = (e) => {
    e.preventDefault();
    const service = bookingForm.service;
    const provider = selectedProvider || providers.find(p => p.skill.toLowerCase() === service.toLowerCase()) || providers[0];
    const price = provider?.price || services.find(s => s.name === service)?.price || 299;
    const newBooking = {
      id: `HF-${Math.floor(1000 + Math.random() * 8999)}`,
      service, provider: provider?.name || 'Provider will be assigned',
      date: bookingForm.date, time: bookingForm.time, price,
      status: 'Requested', address: bookingForm.address || 'Address to be confirmed',
      issue: bookingForm.issue || 'General service request'
    };
    setBookings(prev => [newBooking, ...prev]);
    setShowBooking(false);
    setPage('bookings');
    setToast(`Booking ${newBooking.id} created successfully`);
  };

  const cancelBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id && b.status !== 'Completed' ? { ...b, status: 'Cancelled' } : b));
    setToast('Booking updated');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'providers', label: 'Find a pro', icon: Users },
    { id: 'bookings', label: 'My bookings', icon: ClipboardList },
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? <X size={21}/> : <Menu size={21}/>}</button>
        <button className="brand" onClick={() => setPage('home')} aria-label="HomeFix home">
          <span className="brand-mark"><Wrench size={22} strokeWidth={2.7}/></span>
          <span className="brand-name">home<span>fix</span><small>HOME SERVICES, MADE SIMPLE</small></span>
        </button>
        <div className="location-pill"><MapPin size={16}/><span><small>YOUR LOCATION</small><strong>Guntur, Andhra Pradesh</strong></span><ChevronDown size={15}/></div>
        <div className="top-actions">
          <button className="icon-button notification" aria-label="Notifications" onClick={() => setToast('You’re all caught up!')}><Bell size={19}/><i/></button>
          <button className="profile-button" onClick={() => setShowProfile(!showProfile)}><span className="profile-avatar">T</span><span className="profile-text"><strong>Tharun</strong><small>Customer</small></span><ChevronDown size={14}/></button>
          {showProfile && <div className="profile-popover"><strong>Tharun</strong><span>tharun@example.com</span><button onClick={() => { setShowProfile(false); setToast('Profile settings coming soon'); }}>Profile settings</button><button onClick={() => { setShowProfile(false); setToast('Demo session is active'); }}>Sign out</button></div>}
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
          <div className="side-label">MENU</div>
          {navItems.map(item => <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => { setPage(item.id); setMobileNav(false); }}><item.icon size={18}/><span>{item.label}</span>{item.id === 'bookings' && <b>{bookings.filter(b => !['Completed','Cancelled'].includes(b.status)).length}</b>}</button>)}
          <div className="side-separator"/>
          <div className="side-label">WORKSPACE</div>
          <button className={`nav-item ${page === 'admin' ? 'active' : ''}`} onClick={() => { setPage('admin'); setMobileNav(false); }}><LayoutDashboard size={18}/><span>Admin dashboard</span><span className="demo-tag">DEMO</span></button>
          <button className="nav-item" onClick={() => setToast('Help centre: support@homefix.demo')}><CircleHelp size={18}/><span>Help & support</span></button>
          <div className="sidebar-bottom">
            <div className="help-card"><div className="help-icon"><Phone size={17}/></div><strong>Need a hand?</strong><p>Our support team is here to help you.</p><button onClick={() => setToast('Demo support: support@homefix.demo')}>Contact support <ArrowRight size={14}/></button></div>
            <div className="sidebar-footer"><ShieldCheck size={15}/> Trusted home services</div>
          </div>
        </aside>

        <main className="main-content">
          {page === 'home' && <HomePage onBook={openBooking} onPage={setPage} bookings={bookings} setActiveService={setActiveService} providers={providers} />}
          {page === 'services' && <ServicesPage onBook={openBooking} search={search} setSearch={setSearch} setActiveService={setActiveService} />}
          {page === 'providers' && <ProvidersPage providers={filteredProviders} search={search} setSearch={setSearch} activeService={activeService} setActiveService={setActiveService} onBook={openBooking} />}
          {page === 'bookings' && <BookingsPage bookings={bookings} onCancel={cancelBooking} onBook={() => openBooking()} />}
          {page === 'admin' && <AdminPage bookings={bookings} providers={providers} setProviders={setProviders} tab={adminTab} setTab={setAdminTab} />}
        </main>
      </div>

      <footer className="mobile-bottom-nav">
        {navItems.slice(0,4).map(item => <button key={item.id} className={page === item.id ? 'selected' : ''} onClick={() => setPage(item.id)}><item.icon size={19}/><span>{item.label}</span></button>)}
      </footer>

      {showBooking && <BookingModal form={bookingForm} setForm={setBookingForm} provider={selectedProvider} onClose={() => setShowBooking(false)} onSubmit={submitBooking}/>}
      {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
    </div>
  );
}

function PageHeading({ eyebrow, title, subtitle, right }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{right}</div>;
}

function HomePage({ onBook, onPage, bookings, setActiveService, providers }) {
  const upcoming = bookings.find(b => !['Completed','Cancelled'].includes(b.status));
  return <div className="page-wrap">
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-badge"><span/> YOUR HOME, IN GOOD HANDS</div>
        <h1>Home problems?<br/><em>Consider it fixed.</em></h1>
        <p>Reliable local professionals for all those little things that make a house a home.</p>
        <div className="hero-buttons"><button className="btn-primary" onClick={() => onPage('services')}>Explore services <ArrowRight size={17}/></button><button className="btn-ghost-light" onClick={() => onPage('providers')}>Find a professional</button></div>
        <div className="hero-trust"><div className="mini-avatars"><span>RK</span><span>SR</span><span>LD</span><span>+</span></div><div><strong>2,500+ happy homes</strong><small>Trusted by your neighbours</small></div><div className="trust-divider"/><div><strong className="stars">★★★★★</strong><small>4.8 average rating</small></div></div>
      </div>
      <div className="hero-art">
        <div className="hero-blob"/>
        <div className="house-illustration">
          <div className="roof"></div><div className="house-body"><div className="window w1"/><div className="window w2"/><div className="door"/><div className="plant p1"/><div className="plant p2"/></div>
          <div className="floating-card verified-card"><span className="float-icon"><ShieldCheck size={20}/></span><span><strong>Verified pros</strong><small>Safety comes first</small></span><CheckCircle2 className="float-check" size={17}/></div>
          <div className="floating-card rating-card"><span className="rating-star"><Star size={18} fill="currentColor"/></span><span><strong>4.9/5 rating</strong><small>Loved by customers</small></span></div>
          <div className="floating-spark spark-one">✦</div><div className="floating-spark spark-two">✳</div>
        </div>
      </div>
    </section>

    <section className="stats-strip">
      <div><span className="stat-icon green"><ShieldCheck size={19}/></span><span><strong>Verified professionals</strong><small>Background checked</small></span></div>
      <div><span className="stat-icon yellow"><Clock size={19}/></span><span><strong>On-time service</strong><small>At your convenience</small></span></div>
      <div><span className="stat-icon blue"><Wallet size={19}/></span><span><strong>Transparent pricing</strong><small>No surprise charges</small></span></div>
      <div><span className="stat-icon pink"><MessageCircle size={19}/></span><span><strong>Dedicated support</strong><small>We're here to help</small></span></div>
    </section>

    <section className="section-block">
      <div className="section-head"><div><div className="eyebrow">WHAT CAN WE HELP WITH?</div><h2>Services for every corner</h2><p>Small fixes or big jobs — find the right person for it.</p></div><button className="text-link" onClick={() => onPage('services')}>View all services <ArrowRight size={16}/></button></div>
      <div className="service-grid">{services.slice(0,8).map(s => <ServiceCard key={s.id} service={s} onClick={() => onBook(null,s.name)}/>)}</div>
    </section>

    <section className="section-block pros-section">
      <div className="section-head"><div><div className="eyebrow">PEOPLE YOU CAN TRUST</div><h2>Popular near you</h2><p>Local experts, real reviews, dependable work.</p></div><button className="text-link" onClick={() => onPage('providers')}>Meet all pros <ArrowRight size={16}/></button></div>
      <div className="provider-grid">{providers.slice(0,3).map(p => <ProviderCard key={p.id} provider={p} onBook={() => onBook(p)}/>)}</div>
    </section>

    <section className="bottom-cta"><div className="cta-icon"><CalendarCheck size={26}/></div><div><h3>Good help is just a booking away.</h3><p>Pick a service, choose your time, and leave the rest to us.</p></div><button className="btn-primary" onClick={() => onBook()}>Book a service <ArrowRight size={16}/></button></section>
    {upcoming && <div className="upcoming-banner"><div className="upcoming-icon"><CalendarDays size={19}/></div><div><strong>You have an upcoming {upcoming.service} appointment</strong><p>{upcoming.date} · {upcoming.time} · {upcoming.provider}</p></div><button onClick={() => onPage('bookings')}>View booking <ArrowRight size={15}/></button></div>}
    <div className="page-footer">© 2026 HomeFix · A safer, simpler way to care for your home. <span>Demo project for academic presentation</span></div>
  </div>;
}

function ServiceCard({ service, onClick }) {
  const Icon = service.icon;
  return <button className="service-card" onClick={onClick}><span className={`service-icon ${service.color}`}><Icon size={23}/></span><strong>{service.name}</strong><span className="service-detail">{service.detail}</span><span className="service-price">From {currency(service.price)} <ArrowRight size={14}/></span></button>;
}

function ProviderCard({ provider, onBook }) {
  return <article className="provider-card">
    <div className="provider-top"><div className={`provider-avatar ${provider.color}`}>{provider.initials}</div><div className="provider-main"><strong>{provider.name}</strong><span>{provider.business}</span><div className="provider-skill">{provider.skill}</div></div><button className="small-icon-btn" aria-label="Provider details"><ArrowRight size={16}/></button></div>
    <div className="provider-meta"><span><Star size={15} fill="currentColor" className="star-fill"/> <strong>{provider.rating}</strong> <small>({provider.reviews})</small></span><span><MapPin size={14}/>{provider.distance}</span><span><BadgeCheck size={14}/>{provider.experience}</span></div>
    <div className="provider-bottom"><div><small>Starting from</small><strong>{currency(provider.price)}<small> / visit</small></strong></div><button className="btn-outline" onClick={onBook}>Book now</button></div>
  </article>;
}

function ServicesPage({ onBook, search, setSearch, setActiveService }) {
  const [category, setCategory] = useState('All');
  const shown = services.filter(s => (category === 'All' || s.name === category) && (!search || `${s.name} ${s.detail}`.toLowerCase().includes(search.toLowerCase())));
  return <div className="page-wrap">
    <PageHeading eyebrow="OUR SERVICES" title="What needs fixing?" subtitle="Explore dependable home services with clear starting prices." right={<span className="heading-count">{services.length} services available</span>}/>
    <div className="search-panel"><Search size={19}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plumbing, AC repair, cleaning..."/><button className="btn-primary" onClick={() => setCategory('All')}>Search</button></div>
    <div className="filter-pills">{['All', ...services.map(s => s.name)].map(c => <button key={c} className={category === c ? 'chosen' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <div className="service-grid service-grid-page">{shown.map(s => <ServiceCard key={s.id} service={s} onClick={() => { setActiveService(s.name); onBook(null,s.name); }}/>)}</div>
    <div className="notice-box"><ShieldCheck size={22}/><div><strong>Every booking deserves peace of mind.</strong><p>Look for verified badges, compare reviews, and confirm your service details before the professional arrives.</p></div></div>
    <div className="page-footer">© 2026 HomeFix · Demo prices are illustrative and may vary by service.</div>
  </div>;
}

function ProvidersPage({ providers, search, setSearch, activeService, setActiveService, onBook }) {
  return <div className="page-wrap">
    <PageHeading eyebrow="LOCAL PROFESSIONALS" title="Meet your neighbourhood pros" subtitle="Compare ratings, experience and starting prices before you book." right={<span className="heading-count"><Users size={15}/>{providers.length} professionals</span>}/>
    <div className="search-panel"><Search size={19}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, company or skill..."/><SlidersHorizontal size={18}/></div>
    <div className="filter-pills">{['All services', ...services.map(s => s.name)].map(c => <button key={c} className={activeService === c ? 'chosen' : ''} onClick={() => setActiveService(c)}>{c}</button>)}</div>
    {providers.length ? <div className="provider-grid provider-grid-page">{providers.map(p => <ProviderCard key={p.id} provider={p} onBook={() => onBook(p)}/>)}</div> : <div className="empty-state"><Search size={32}/><h3>No professionals found</h3><p>Try another name or service category.</p><button className="btn-outline" onClick={() => {setSearch('');setActiveService('All services')}}>Clear filters</button></div>}
    <div className="page-footer">Provider profiles are sample data for demonstration. Verification must be completed before real-world launch.</div>
  </div>;
}

function BookingsPage({ bookings, onCancel, onBook }) {
  const [filter, setFilter] = useState('All');
  const visible = bookings.filter(b => filter === 'All' || b.status === filter);
  return <div className="page-wrap">
    <PageHeading eyebrow="YOUR HOMEFIX ACTIVITY" title="My bookings" subtitle="Keep track of appointments, service updates and completed jobs." right={<button className="btn-primary" onClick={onBook}><Plus size={17}/> New booking</button>}/>
    <div className="booking-summary"><div><span className="summary-icon purple"><ClipboardList size={19}/></span><span><small>Total bookings</small><strong>{bookings.length}</strong></span></div><div><span className="summary-icon green"><CircleCheck size={19}/></span><span><small>Completed</small><strong>{bookings.filter(b=>b.status==='Completed').length}</strong></span></div><div><span className="summary-icon orange"><Clock size={19}/></span><span><small>In progress</small><strong>{bookings.filter(b=>!['Completed','Cancelled'].includes(b.status)).length}</strong></span></div></div>
    <div className="table-toolbar"><div className="filter-pills compact">{['All','Requested','Confirmed','Completed','Cancelled'].map(f => <button key={f} className={filter===f?'chosen':''} onClick={()=>setFilter(f)}>{f}</button>)}</div><span className="muted-small">{visible.length} booking(s)</span></div>
    <div className="booking-list">{visible.map(b => <article className="booking-card" key={b.id}><div className="booking-symbol"><Wrench size={21}/></div><div className="booking-info"><div className="booking-title-row"><strong>{b.service}</strong><span className={`status-pill ${statusClass(b.status)}`}>{b.status}</span></div><span className="booking-id">{b.id} · {b.provider}</span><div className="booking-details"><span><CalendarDays size={14}/>{b.date}</span><span><Clock size={14}/>{b.time}</span><span><MapPin size={14}/>{b.address}</span></div>{b.issue && <p className="booking-issue">“{b.issue}”</p>}</div><div className="booking-price"><strong>{currency(b.price)}</strong><small>Estimated total</small>{!['Completed','Cancelled'].includes(b.status) && <button onClick={()=>onCancel(b.id)}>Cancel booking</button>}</div></article>)}
    {visible.length===0 && <div className="empty-state"><ClipboardList size={32}/><h3>No bookings in this category</h3><p>Your bookings will appear here after you make a request.</p><button className="btn-primary" onClick={onBook}>Book a service</button></div>}</div>
    <div className="page-footer">For this demo, bookings are saved in this browser using local storage. Production deployment requires a shared database and authenticated accounts.</div>
  </div>;
}

function AdminPage({ bookings, providers, setProviders, tab, setTab }) {
  const total = bookings.reduce((sum,b)=>sum+Number(b.price||0),0);
  const adminTabs = ['Overview','Bookings','Providers','Services'];
  return <div className="page-wrap">
    <PageHeading eyebrow="OPERATIONS CENTRE" title="Admin dashboard" subtitle="A quick view of service activity across the HomeFix platform." right={<span className="demo-pill"><span/> Demo data</span>}/>
    <div className="admin-tabs">{adminTabs.map(t=><button className={tab===t?'selected':''} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div>
    {tab==='Overview' && <>
      <div className="admin-metrics"><Metric icon={Users} label="Registered customers" value="1,284" trend="+12.8%" color="green"/><Metric icon={BadgeCheck} label="Service providers" value={providers.length.toString()} trend="Sample profiles" color="blue"/><Metric icon={ClipboardList} label="Total bookings" value={bookings.length.toString()} trend={`${bookings.filter(b=>b.status==='Completed').length} completed`} color="purple"/><Metric icon={Wallet} label="Booking value" value={currency(total)} trend="Illustrative" color="orange"/></div>
      <div className="admin-columns"><div className="admin-panel"><div className="panel-title"><div><h3>Recent bookings</h3><p>Latest service requests</p></div><span className="soft-tag">Live demo</span></div>{bookings.slice(0,5).map(b=><div className="admin-booking-row" key={b.id}><span className="tiny-service-icon"><Wrench size={16}/></span><span className="admin-booking-name"><strong>{b.service}</strong><small>{b.id} · {b.provider}</small></span><span className={`status-pill ${statusClass(b.status)}`}>{b.status}</span><strong>{currency(b.price)}</strong></div>)}</div>
      <div className="admin-panel"><div className="panel-title"><div><h3>Popular services</h3><p>Illustrative demand split</p></div></div>{[['AC repair',32],['Plumbing',25],['Electrician',21],['Cleaning',14],['Other',8]].map(([name,pct])=><div className="bar-row" key={name}><div><span>{name}</span><strong>{pct}%</strong></div><div className="bar-track"><span style={{width:`${pct}%`}}/></div></div>)}</div></div>
    </>}
    {tab==='Bookings' && <div className="admin-panel"><div className="panel-title"><div><h3>All bookings</h3><p>Booking overview for demo</p></div></div>{bookings.map(b=><div className="admin-booking-row" key={b.id}><span className="tiny-service-icon"><Wrench size={16}/></span><span className="admin-booking-name"><strong>{b.service}</strong><small>{b.id} · {b.date} · {b.provider}</small></span><span className={`status-pill ${statusClass(b.status)}`}>{b.status}</span><strong>{currency(b.price)}</strong></div>)}</div>}
    {tab==='Providers' && <div className="admin-panel"><div className="panel-title"><div><h3>Provider directory</h3><p>Toggle demo verification status</p></div></div>{providers.map(p=><div className="admin-booking-row" key={p.id}><span className={`provider-avatar small ${p.color}`}>{p.initials}</span><span className="admin-booking-name"><strong>{p.name}</strong><small>{p.skill} · {p.business}</small></span><span className={`status-pill ${p.verified?'completed':'requested'}`}>{p.verified?'Verified':'Pending review'}</span><button className="btn-outline compact-btn" onClick={()=>setProviders(prev=>prev.map(x=>x.id===p.id?{...x,verified:!x.verified}:x))}>{p.verified?'Unverify':'Verify'}</button></div>)}</div>}
    {tab==='Services' && <div className="service-grid service-grid-page">{services.map(s=><ServiceCard key={s.id} service={s} onClick={()=>{}}/>)}</div>}
    <div className="notice-box"><ShieldCheck size={22}/><div><strong>Demo / academic project notice</strong><p>Metrics, provider identities and ratings shown here are sample data. Do not use these figures as real business claims.</p></div></div>
    <div className="page-footer">HomeFix admin demo · Production admin access must be protected by role-based authentication.</div>
  </div>;
}

function Metric({ icon: Icon, label, value, trend, color }) {
  return <div className="metric-card"><span className={`metric-icon ${color}`}><Icon size={20}/></span><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><span className="metric-trend"><TrendingUp size={13}/>{trend}</span></div>;
}

function BookingModal({ form, setForm, provider, onClose, onSubmit }) {
  const update = (key,value) => setForm(prev=>({...prev,[key]:value}));
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="booking-modal"><div className="modal-header"><div><div className="eyebrow">LET'S GET IT FIXED</div><h2>Book a service</h2><p>Share a few details to create your service request.</p></div><button className="icon-button" onClick={onClose}><X size={20}/></button></div>
    {provider && <div className="selected-pro"><span className={`provider-avatar ${provider.color}`}>{provider.initials}</span><span><strong>{provider.name}</strong><small>{provider.skill} · ⭐ {provider.rating}</small></span><span className="selected-price">{currency(provider.price)}</span></div>}
    <form onSubmit={onSubmit} className="booking-form">
      <label>Service category<select value={form.service} onChange={e=>update('service',e.target.value)}>{services.map(s=><option key={s.id}>{s.name}</option>)}</select></label>
      <div className="form-row"><label>Preferred date<input type="date" required min="2026-10-18" value={form.date} onChange={e=>update('date',e.target.value)}/></label><label>Time slot<select value={form.time} onChange={e=>update('time',e.target.value)}><option>09:00 AM</option><option>10:00 AM</option><option>12:00 PM</option><option>02:00 PM</option><option>04:30 PM</option><option>06:00 PM</option></select></label></div>
      <label>Service address<input required value={form.address} onChange={e=>update('address',e.target.value)} placeholder="House no., street, area"/></label>
      <label>Describe the issue<textarea value={form.issue} onChange={e=>update('issue',e.target.value)} placeholder="Tell us what needs attention..." rows="3"/></label>
      <div className="modal-note"><ShieldCheck size={17}/><span>This is a demo booking. No payment is collected and no real provider is notified.</span></div>
      <div className="modal-actions"><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button type="submit" className="btn-primary">Confirm booking <ArrowRight size={16}/></button></div>
    </form>
  </div></div>;
}

export default App;
