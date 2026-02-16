
import React, { useState, useEffect } from 'react';
import { Candidate } from '../types';

interface CandidateComparisonProps {
  candidates: Candidate[];
}

const CandidateComparison: React.FC<CandidateComparisonProps> = ({ candidates }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (candidates.length > 0 && selectedIds.length === 0) {
      setSelectedIds(candidates.slice(0, 2).map(c => c.id));
    }
  }, [candidates]);

  const toggleCandidate = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedCandidates = candidates.filter(c => selectedIds.includes(c.id));

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">เปรียบเทียบผู้สมัครและพรรค</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">ข้อมูลผู้สมัครที่กำหนดโดยผู้ดูแลระบบ</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {candidates.map(c => (
            <button
              key={c.id}
              onClick={() => toggleCandidate(c.id)}
              className={`px-6 py-3 rounded-full text-[10px] font-bold border-2 transition-all duration-300 ${
                selectedIds.includes(c.id)
                  ? `bg-slate-900 text-white border-transparent shadow-lg scale-105`
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: c.color}}></div>
                {c.party}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedCandidates.length > 0 ? (
        <div className={`grid grid-cols-1 md:grid-cols-${selectedCandidates.length} gap-8`}>
          {selectedCandidates.map(c => (
            <div key={c.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
              <div className="relative h-64">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <i className="fas fa-user-circle text-6xl"></i>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e]/90 via-[#1a237e]/20 to-transparent"></div>
                <div className="absolute bottom-6 left-8 right-8 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-amber-500 text-[#1a237e] rounded-lg mb-3 inline-block">
                    {c.party}
                  </span>
                  <h3 className="text-2xl font-bold leading-tight">{c.name}</h3>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <section>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <i className="fas fa-id-card text-slate-300"></i>
                    คะแนนล่าสุด
                  </h4>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {new Intl.NumberFormat().format(c.votes)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-bold">จากระบบ {c.votes > 0 ? 'Google Sheets' : 'Manual'}</p>
                </section>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400">ยังไม่มีข้อมูลพรรคการเมือง กรุณาไปที่เมนู Admin เพื่อจัดการข้อมูล</p>
        </div>
      )}
    </div>
  );
};

export default CandidateComparison;
