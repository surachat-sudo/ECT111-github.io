
import React, { useState } from 'react';
import { ManagedParty, AdminSettings, UserAccount, Candidate } from '../types';

interface AdminPanelProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  settings: AdminSettings;
  setSettings: (settings: AdminSettings) => void;
  onRefresh: () => void;
  currentUser: string | null;
  setCurrentUser: (user: string | null) => void;
  syncedCandidates?: Candidate[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isAdmin, setIsAdmin, settings, setSettings, onRefresh, currentUser, setCurrentUser, syncedCandidates = []
}) => {
  const [view, setView] = useState<'login' | 'signup' | 'pending'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [syncingStatus, setSyncingStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  const [newParty, setNewParty] = useState<ManagedParty>({
    id: '', name: '', candidateName: '', image: '', color: '#3b82f6'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // MASTER ADMIN BYPASS
    if (username === 'ECT1' && password === 'ect1231') {
      setIsAdmin(true);
      setCurrentUser('ECT1');
      return;
    }

    const account = settings.accounts.find(a => a.username === username);
    if (account && account.password === password) {
      if (account.status === 'approved') {
        setIsAdmin(true);
        setCurrentUser(username);
      } else {
        setView('pending');
        setCurrentUser(username);
      }
    } else {
      setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    if (settings.accounts.some(a => a.username === username)) {
      setError('ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว');
      return;
    }
    const newAcc: UserAccount = {
      username,
      password,
      status: 'pending',
      role: 'admin',
      requestDate: new Date().toLocaleString('th-TH')
    };
    setSettings({ ...settings, accounts: [...settings.accounts, newAcc] });
    setCurrentUser(username);
    setView('pending');
  };

  const approveUser = async (uname: string) => {
    // SECURITY: Only ECT1 can approve
    if (currentUser !== 'ECT1') return;
    
    const userToApprove = settings.accounts.find(a => a.username === uname);
    if (!userToApprove) return;
    setSyncingStatus(prev => ({ ...prev, [uname]: 'loading' }));
    try {
      await fetch(settings.syncScriptUrl, {
        method: "POST",
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userToApprove.username, pass: userToApprove.password })
      });
      setSettings({
        ...settings,
        accounts: settings.accounts.map(a => a.username === uname ? { ...a, status: 'approved' } : a)
      });
      setSyncingStatus(prev => ({ ...prev, [uname]: 'success' }));
      onRefresh();
    } catch (err) {
      setSyncingStatus(prev => ({ ...prev, [uname]: 'error' }));
    }
  };

  const removeUser = (uname: string) => {
    // SECURITY: Only ECT1 can delete accounts
    if (currentUser !== 'ECT1' || uname === 'ECT1') return;
    
    setSettings({
      ...settings,
      accounts: settings.accounts.filter(a => a.username !== uname)
    });
  };

  const updatePartyStyle = (partyName: string, imageUrl: string, colorCode: string) => {
    const existingIndex = settings.parties.findIndex(p => p.name === partyName);
    if (existingIndex !== -1) {
      const updatedParties = [...settings.parties];
      updatedParties[existingIndex] = { ...updatedParties[existingIndex], image: imageUrl, color: colorCode };
      setSettings({ ...settings, parties: updatedParties });
    } else {
      const newP: ManagedParty = {
        id: `custom-${Date.now()}`,
        name: partyName,
        candidateName: '',
        image: imageUrl,
        color: colorCode
      };
      setSettings({ ...settings, parties: [...settings.parties, newP] });
    }
  };

  const addParty = () => {
    if (!newParty.name) return;
    setSettings({
      ...settings,
      parties: [...settings.parties, { ...newParty, id: Date.now().toString() }]
    });
    setNewParty({ id: '', name: '', candidateName: '', image: '', color: '#3b82f6' });
  };

  if (!isAdmin && view === 'pending') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-amber-100 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-clock text-3xl animate-pulse"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-800">ส่งคำขอสำเร็จ</h2>
          <p className="text-slate-500 mt-4 text-sm font-medium">บัญชี <span className="text-indigo-600 font-bold">{currentUser}</span> อยู่ระหว่างรอการอนุมัติ</p>
          <button onClick={() => setView('login')} className="mt-8 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-600">กลับหน้าล็อกอิน</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
          <div className="text-center mb-10">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${view === 'login' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <i className={`fas ${view === 'login' ? 'fa-shield-halved' : 'fa-user-plus'} text-2xl`}></i>
            </div>
            <h2 className="text-2xl font-black text-slate-800">{view === 'login' ? 'เข้าสู่ระบบ Admin' : 'สมัครสมาชิกใหม่'}</h2>
          </div>
          <form onSubmit={view === 'login' ? handleLogin : handleSignUp} className="space-y-4">
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" />
            {error && <div className="text-red-500 text-[10px] font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
            <button type="submit" className={`w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all ${view === 'login' ? 'bg-[#1a237e]' : 'bg-emerald-600'}`}>
              {view === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียนขอสิทธิ์'}
            </button>
          </form>
          <button onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(''); }} className="w-full mt-6 text-slate-400 font-bold text-xs hover:text-indigo-600">
            {view === 'login' ? 'สมัครบัญชีเจ้าหน้าที่ใหม่' : 'กลับหน้าล็อกอิน'}
          </button>
        </div>
      </div>
    );
  }

  const pendingUsers = settings.accounts.filter(a => a.status === 'pending');
  const approvedUsers = settings.accounts.filter(a => a.status === 'approved');

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* 1. ส่วนคำขอรออนุมัติ (Pending) - แสดงผลเฉพาะ MASTER (ECT1) เท่านั้น */}
      {currentUser === 'ECT1' && (
        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <i className="fas fa-user-clock"></i>
              </div>
              คำขอรออนุมัติ ({pendingUsers.length}) <span className="text-[10px] bg-amber-400 text-white px-3 py-1 rounded-lg">Master Only</span>
            </h3>
            <button onClick={onRefresh} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 text-[10px] font-black uppercase">
               <i className="fas fa-sync-alt"></i> อัปเดตคำขอ
            </button>
          </div>
          {pendingUsers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pendingUsers.map(u => (
                <div key={u.username} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">{u.username}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ขอเมื่อ: {u.requestDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => approveUser(u.username)} 
                      disabled={syncingStatus[u.username] === 'loading'}
                      className="bg-indigo-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {syncingStatus[u.username] === 'loading' ? 'กำลังส่งข้อมูล...' : 'อนุมัติสิทธิ์'}
                    </button>
                    <button onClick={() => removeUser(u.username)} className="p-4 text-slate-300 hover:text-red-500">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
              <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest italic">ไม่มีคำขอที่รอการอนุมัติ</p>
            </div>
          )}
        </section>
      )}

      {/* 2. รายชื่อเจ้าหน้าที่ทั้งหมด (Account List) - แสดงผลเฉพาะ MASTER (ECT1) เท่านั้นสำหรับการจัดการ */}
      {currentUser === 'ECT1' && (
        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-users-cog"></i>
              </div>
              จัดการบัญชีเจ้าหน้าที่ในระบบ <span className="text-[10px] bg-indigo-500 text-white px-3 py-1 rounded-lg">Master Only</span>
            </h3>
            <button onClick={onRefresh} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2 text-[10px] font-black uppercase">
               <i className="fas fa-sync-alt"></i> รีเฟรชรายชื่อจาก Sheet
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 bg-[#1a237e] text-white rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className="fas fa-crown text-amber-400"></i>
                <span className="font-black text-sm">ECT1 (Master)</span>
              </div>
              <span className="text-[8px] bg-white/20 px-2 py-1 rounded font-bold uppercase">System</span>
            </div>
            {approvedUsers.map(u => (
              <div key={u.username} className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between group transition-all">
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-emerald-500"></i>
                  <span className="font-black text-slate-800 text-sm">{u.username}</span>
                </div>
                <button onClick={() => removeUser(u.username)} className="text-red-300 hover:text-red-500 p-2">
                  <i className="fas fa-user-minus"></i>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. จัดการพรรคและรูปภาพ (Candidate Management) - ทุก Admin สามารถทำได้ */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <i className="fas fa-id-card"></i>
            </div>
            จัดการผู้สมัครและพรรคการเมือง
          </h3>
          <button onClick={onRefresh} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 flex items-center gap-2">
            <i className="fas fa-sync-alt"></i> อัปเดตข้อมูลจาก Sheet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {syncedCandidates.map(c => (
            <div key={c.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-inner flex-shrink-0">
                  {c.image ? <img src={c.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><i className="fas fa-user-circle text-4xl"></i></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-4 h-4 rounded-full" style={{backgroundColor: c.color}}></span>
                    <h4 className="font-black text-slate-800 text-xl truncate">{c.party}</h4>
                  </div>
                  <p className="text-xs font-bold text-indigo-600">แคนดิเดต: {c.name}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">วาง URL รูปภาพแคนดิเดต</label>
                   <input type="text" placeholder="https://example.com/photo.jpg" value={c.image} onChange={e => updatePartyStyle(c.party, e.target.value, c.color)} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[10px] font-bold outline-none" />
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">สีประจำพรรค</label>
                      <input type="color" value={c.color} onChange={e => updatePartyStyle(c.party, c.image, e.target.value)} className="h-10 w-full rounded-lg cursor-pointer" />
                    </div>
                 </div>
              </div>
            </div>
          ))}
          
          <div className="p-8 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4">
             <i className="fas fa-plus text-slate-300 text-2xl"></i>
             <p className="text-slate-400 text-[10px] font-bold uppercase">เพิ่มพรรคแบบ Manual</p>
             <input type="text" placeholder="ระบุชื่อพรรค..." value={newParty.name} onChange={e => setNewParty({...newParty, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none" />
             <button onClick={addParty} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase">บันทึกข้อมูล</button>
          </div>
        </div>
      </section>

      {/* 4. ตั้งค่า Database - ทุก Admin สามารถทำได้ */}
      <section className="bg-slate-900 p-10 rounded-[3rem] text-white">
        <h3 className="text-xs font-black text-amber-400 mb-8 uppercase tracking-widest flex items-center gap-3">
          <i className="fas fa-database"></i> Database Connections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[9px] font-bold text-white/40 uppercase block">Auth Database (CSV)</label>
            <input type="text" value={settings.authSheetUrl} onChange={e => setSettings({...settings, authSheetUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-mono text-amber-100" />
          </div>
          <div className="space-y-3">
            <label className="text-[9px] font-bold text-white/40 uppercase block">Vote Database (CSV)</label>
            <input type="text" value={settings.voteSheetUrl} onChange={e => setSettings({...settings, voteSheetUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-mono text-amber-100" />
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center gap-6 pt-10">
        <button onClick={() => {setIsAdmin(false); setCurrentUser(null);}} className="bg-red-50 text-red-600 px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all">
          <i className="fas fa-power-off mr-2"></i> ออกจากระบบจัดการ
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
