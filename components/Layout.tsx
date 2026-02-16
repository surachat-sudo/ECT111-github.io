
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isAdmin }) => {
  const tabs = [
    { id: 'dashboard', label: 'แดชบอร์ดภาพรวม', icon: 'fa-chart-line' },
    { id: 'voting-station', label: 'หน่วยเลือกตั้งจำลอง', icon: 'fa-tv' },
    { id: 'candidates', label: 'ข้อมูลพรรค/ผู้สมัคร', icon: 'fa-users' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      <div className="thai-flag-top fixed top-0 left-0 right-0 z-[60] w-full"></div>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#1a237e] text-white h-screen sticky top-0 border-r border-white/10 shadow-2xl">
        <div className="p-8 border-b border-white/5 flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white/20">
            <i className="fas fa-vote-yea text-4xl text-[#1a237e]"></i>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">ECT Vision</h1>
            <p className="text-[10px] text-amber-200 font-medium uppercase tracking-widest mt-1">ระบบรายงานผลบัญชีรายชื่อ</p>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-[#1a237e] shadow-lg font-bold scale-105'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <i className={`fas ${tab.icon} w-6 text-lg`}></i>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10">
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                activeTab === 'admin'
                  ? 'bg-red-600 text-white shadow-lg font-bold scale-105'
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <i className="fas fa-user-shield w-6 text-lg"></i>
              <span className="text-sm">{isAdmin ? 'ระบบจัดการ (Admin)' : 'เข้าสู่ระบบ Admin'}</span>
            </button>
          </div>
        </nav>
        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
             <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-white/40 uppercase">System Status</span>
               <span className="text-xs font-bold text-emerald-400">เชื่อมต่อฐานข้อมูลสด</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#1a237e] text-white p-4 sticky top-1 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
           <i className="fas fa-vote-yea text-amber-400"></i>
           <span className="font-bold text-sm tracking-tighter">ECT LIVE</span>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeTab === tab.id ? 'bg-amber-500 text-[#1a237e]' : 'text-white/40'}`}
            >
              <i className={`fas ${tab.icon} text-sm`}></i>
            </button>
          ))}
          <button
            onClick={() => setActiveTab('admin')}
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeTab === 'admin' ? 'bg-red-500 text-white' : 'text-white/40'}`}
          >
            <i className="fas fa-lock text-sm"></i>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-auto mt-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
