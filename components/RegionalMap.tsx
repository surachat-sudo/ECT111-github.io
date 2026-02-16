
import React from 'react';
import { REGION_RESULTS } from '../constants';

const RegionalMap: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">ผลการนับคะแนนรายจังหวัด</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">อ้างอิงจากข้อมูลการนับคะแนนเบื้องต้น (Real-time)</p>
        </div>
        <div className="flex flex-wrap gap-5 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#00adef]"></div>
            <span className="text-xs font-bold text-slate-700">พัฒนาชาติ (ดร.วิรัช)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#f97316]"></div>
            <span className="text-xs font-bold text-slate-700">ก้าวหน้า (อนงค์)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#1e40af]"></div>
            <span className="text-xs font-bold text-slate-700">รักไทย (พล.อ.สมชาย)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {REGION_RESULTS.map((res, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-lg hover:border-amber-300 transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-extrabold text-lg shadow-md transition-transform group-hover:rotate-6 group-hover:scale-110`}
                style={{ backgroundColor: res.winner.includes('วิรัช') ? '#00adef' : res.winner.includes('อนงค์') ? '#f97316' : '#1e40af' }}
              >
                <span className="text-[8px] opacity-70 leading-none mb-1 uppercase">ที่นั่ง</span>
                {res.electoralVotes}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{res.region}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">คะแนนนำ: +{res.margin}%</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">พรรคที่ชนะ</span>
               <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm ${
                 res.winner.includes('วิรัช') ? 'bg-blue-50 text-blue-600' : res.winner.includes('อนงค์') ? 'bg-orange-50 text-orange-600' : 'bg-indigo-50 text-indigo-600'
               }`}>
                 {res.winner.split(' ')[1]}
               </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1a237e] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="thai-flag-top absolute top-0 left-0 right-0 w-full opacity-30"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h3 className="text-3xl font-extrabold mb-6">เส้นทางสู่ 251 ที่นั่ง (กึ่งหนึ่ง)</h3>
            <p className="text-indigo-200 text-sm mb-8 leading-relaxed font-medium">
              ปัจจุบันพรรคพัฒนาชาตินำอยู่ที่ 145 ที่นั่ง ตามด้วยพรรคก้าวหน้า 132 ที่นั่ง และพรรครักไทย 42 ที่นั่ง ยังมีที่นั่งที่อยู่ระหว่างการนับคะแนนอีก 181 ที่นั่ง ซึ่งจะเป็นจุดตัดสินว่าใครจะได้จัดตั้งรัฐบาล
            </p>
            <div className="w-full h-6 bg-white/10 rounded-full overflow-hidden flex shadow-inner border border-white/5">
               <div className="h-full bg-[#00adef]" style={{ width: '29%' }}></div>
               <div className="h-full bg-[#f97316]" style={{ width: '26.4%' }}></div>
               <div className="h-full bg-[#1e40af]" style={{ width: '8.4%' }}></div>
               <div className="h-full bg-white/20" style={{ width: '36.2%' }}></div>
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
              <span>พัฒนาชาติ (145)</span>
              <span className="text-amber-400 font-extrabold">เป้าหมาย 251</span>
              <span>ก้าวหน้า (132)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg">
               <p className="text-amber-400 text-[10px] uppercase font-bold mb-2 tracking-[0.2em]">เขตสมรภูมิ (Swing)</p>
               <h4 className="font-extrabold text-lg">นนทบุรี เขต 1</h4>
               <p className="text-xs text-orange-300 mt-2 font-bold bg-orange-500/10 inline-block px-2 py-1 rounded">ก้าวหน้านำ +0.8%</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg">
               <p className="text-amber-400 text-[10px] uppercase font-bold mb-2 tracking-[0.2em]">พื้นที่เฝ้าระวัง</p>
               <h4 className="font-extrabold text-lg">นครราชสีมา</h4>
               <p className="text-xs text-blue-300 mt-2 font-bold bg-blue-500/10 inline-block px-2 py-1 rounded">นับแล้ว 98% (สูสีมาก)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalMap;
