
import React from 'react';
import { Candidate } from '../types';

interface VotingStationProps {
  candidates: Candidate[];
}

const VotingStation: React.FC<VotingStationProps> = ({ candidates }) => {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  const totalVotes = candidates.reduce((acc, c) => acc + c.votes, 0);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#1a237e] p-8 rounded-[2.5rem] shadow-2xl text-white border-4 border-amber-400/30">
        <div>
          <h2 className="text-3xl font-black mb-2">หน่วยเลือกตั้งจำลอง (Live Result Board)</h2>
          <p className="text-amber-200 font-bold flex items-center gap-2">
            <i className="fas fa-circle text-[8px] animate-pulse"></i>
            รายงานผลคะแนนบัญชีรายชื่อ แบบเรียลไทม์
          </p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">คะแนนรวมทั้งหมด</p>
          <p className="text-5xl font-black text-amber-400">{new Intl.NumberFormat().format(totalVotes)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sortedCandidates.map((c, idx) => (
          <div key={c.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6 hover:border-amber-400 transition-all hover:shadow-xl group">
            <div className="text-4xl font-black text-slate-300 w-16 text-center group-hover:text-amber-500 transition-colors">
              {idx + 1}
            </div>
            
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md bg-slate-100 flex-shrink-0">
              {c.image ? (
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                  <i className="fas fa-image text-2xl"></i>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xl font-extrabold text-slate-900 truncate">{c.party}</h4>
              <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                {c.name || 'ไม่ระบุชื่อผู้สมัคร'}
              </p>
              
              {/* Progress bar based on share */}
              <div className="w-full h-3 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    backgroundColor: c.color, 
                    width: `${totalVotes > 0 ? (c.votes / totalVotes * 100) : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="text-right pl-6 border-l border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">จำนวนคะแนน</p>
              <p className="text-4xl font-black text-slate-900 tabular-nums">
                {new Intl.NumberFormat().format(c.votes)}
              </p>
              <p className="text-xs font-bold text-emerald-600 mt-1">
                {totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(2) : '0.00'}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {sortedCandidates.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
           <i className="fas fa-folder-open text-6xl text-slate-200 mb-6"></i>
           <p className="text-slate-400 font-bold text-lg">ไม่พบข้อมูลคะแนนในระบบ กรุณาตั้งค่าผ่านหน้า Admin</p>
        </div>
      )}
    </div>
  );
};

export default VotingStation;
