
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CandidateComparison from './components/CandidateComparison';
import RegionalMap from './components/RegionalMap';
import AdminPanel from './components/AdminPanel';
import VotingStation from './components/VotingStation';
import { AdminSettings, Candidate, UserAccount, ManagedParty } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [liveVotes, setLiveVotes] = useState<Record<string, { 
    votes: number; 
    candidateName: string;
    color?: string;
    image?: string;
  }>>({});
  const [discoveredAccounts, setDiscoveredAccounts] = useState<UserAccount[]>([]);
  
  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('ect_settings');
    const defaultSettings: AdminSettings = {
      authSheetUrl: 'https://docs.google.com/spreadsheets/d/1VHEwHdgFrNUx_Post8oQlig6pVDwhEfH1V0kY8ltiLM/export?format=csv&gid=0',
      voteSheetUrl: 'https://docs.google.com/spreadsheets/d/17mtBf03SS0lT81v0j9USKP_Poq6kgi0VsUi_AgC17Bk/export?format=csv&gid=0',
      syncScriptUrl: 'https://script.google.com/macros/s/AKfycbzfT5i4YEc-mhUmFFKz7JksRAskJ1K5QnjU0cr5XQO5oEZtEmudIdECXw6BDyYmw5OZJA/exec',
      parties: [],
      accounts: []
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('ect_settings', JSON.stringify(settings));
  }, [settings]);

  const toCsvUrl = (url: string) => {
    if (!url) return '';
    let processed = url;
    if (processed.includes('/edit')) {
      processed = processed.replace(/\/edit.*$/, '/export?format=csv');
    }
    return `${processed}${processed.includes('?') ? '&' : '?'}t=${Date.now()}`;
  };

  const syncAllData = async () => {
    // Sync บัญชีเจ้าหน้าที่
    if (settings.authSheetUrl) {
      try {
        const response = await fetch(toCsvUrl(settings.authSheetUrl));
        const csvText = await response.text();
        const rows = csvText.split(/\r?\n/).filter(r => r.trim());
        const accs: UserAccount[] = [];
        rows.forEach((row, i) => {
          if (i === 0) return;
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols[0] && cols[1]) {
            accs.push({
              username: cols[0],
              password: cols[1],
              status: 'approved',
              role: 'admin',
              requestDate: 'Synced: Auth DB'
            });
          }
        });
        setDiscoveredAccounts(accs);
      } catch (e) { console.error("Auth Sync Error", e); }
    }

    // Sync คะแนน และข้อมูลเพิ่มเติม (Column A=พรรค, B=คะแนน, C=ชื่อแคนดิเดต, D=สี, E=รูป)
    if (settings.voteSheetUrl) {
      try {
        const response = await fetch(toCsvUrl(settings.voteSheetUrl));
        const csvText = await response.text();
        const rows = csvText.split(/\r?\n/).filter(r => r.trim());
        const vMap: Record<string, { votes: number; candidateName: string; color?: string; image?: string }> = {};
        rows.forEach((row, i) => {
          if (i === 0) return;
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols[0]) {
            vMap[cols[0]] = { 
              votes: parseInt(cols[1], 10) || 0, 
              candidateName: cols[2] || 'ยังไม่ระบุชื่อ',
              color: cols[3], // Column D: Color Code (#XXXXXX)
              image: cols[4]  // Column E: Image URL
            };
          }
        });
        setLiveVotes(vMap);
      } catch (e) { console.error("Vote Sync Error", e); }
    }
  };

  useEffect(() => {
    syncAllData();
    const interval = setInterval(syncAllData, 15000);
    return () => clearInterval(interval);
  }, [settings.authSheetUrl, settings.voteSheetUrl]);

  const allAccounts = useMemo(() => {
    const map = new Map<string, UserAccount>();
    discoveredAccounts.forEach(a => map.set(a.username, a));
    settings.accounts.forEach(a => {
      if (a.status === 'pending' && !map.has(a.username)) map.set(a.username, a);
    });
    return Array.from(map.values());
  }, [settings.accounts, discoveredAccounts]);

  const dynamicCandidates: Candidate[] = useMemo(() => {
    const candidates: Candidate[] = [];
    const processedParties = new Set<string>();

    // 1. นำรายชื่อพรรคจาก settings มาตั้งต้น
    settings.parties.forEach(p => {
      const live = liveVotes[p.name];
      candidates.push({
        id: p.id,
        name: live?.candidateName || p.candidateName || 'ไม่ระบุชื่อ',
        party: p.name,
        votes: live?.votes || 0,
        // ลำดับความสำคัญ: ข้อมูลจาก Sheet (D) > ข้อมูลที่ตั้งเองใน Admin > ค่าเริ่มต้น
        color: (live?.color && live.color.startsWith('#')) ? live.color : (p.color || '#3b82f6'),
        // ลำดับความสำคัญ: ข้อมูลจาก Sheet (E) > ข้อมูลที่ตั้งเองใน Admin > ค่าเริ่มต้น
        image: (live?.image && live.image.startsWith('http')) ? live.image : (p.image || ''),
        description: `พรรค${p.name}`,
        keyPolicies: []
      });
      processedParties.add(p.name);
    });

    // 2. ถ้าใน Sheet มีพรรคที่ยังไม่เคยตั้งค่าใน settings ให้สร้างเป็น Auto-Candidate
    Object.keys(liveVotes).forEach(name => {
      if (!processedParties.has(name) && isNaN(parseInt(name))) {
        const live = liveVotes[name];
        candidates.push({
          id: `auto-${name}`,
          name: live.candidateName,
          party: name,
          votes: live.votes,
          color: (live.color && live.color.startsWith('#')) ? live.color : '#cbd5e1',
          image: (live.image && live.image.startsWith('http')) ? live.image : '',
          description: `ตรวจพบจาก Vote Sheet`,
          keyPolicies: []
        });
      }
    });

    return candidates.sort((a, b) => b.votes - a.votes);
  }, [settings.parties, liveVotes]);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin}>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight lg:text-5xl">
            {activeTab === 'admin' ? 'ศูนย์ควบคุม กกต. (Admin)' : activeTab === 'voting-station' ? 'Live Result Board' : 'ECT Dashboard'}
          </h1>
          <p className="text-slate-500 mt-3 text-sm font-medium">
            เชื่อมต่อ {discoveredAccounts.length} บัญชี และ {Object.keys(liveVotes).length} พรรคการเมือง
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth DB Connected</span>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
             <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vote DB Connected</span>
          </div>
        </div>
      </div>
      
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
        {activeTab === 'dashboard' && <Dashboard candidates={dynamicCandidates} />}
        {activeTab === 'voting-station' && <VotingStation candidates={dynamicCandidates} />}
        {activeTab === 'candidates' && <CandidateComparison candidates={dynamicCandidates} />}
        {activeTab === 'map' && <RegionalMap />}
        {activeTab === 'admin' && (
          <AdminPanel 
            isAdmin={isAdmin} 
            setIsAdmin={setIsAdmin} 
            settings={{...settings, accounts: allAccounts}} 
            setSettings={setSettings} 
            onRefresh={syncAllData}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            syncedCandidates={dynamicCandidates}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
