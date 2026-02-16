
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';
import { Candidate } from '../types';

interface DashboardProps {
  candidates: Candidate[];
}

const Dashboard: React.FC<DashboardProps> = ({ candidates }) => {
  const totalVotes = useMemo(() => candidates.reduce((acc, c) => acc + c.votes, 0), [candidates]);
  
  const chartData = useMemo(() => [...candidates]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5) // Top 5
    .map(c => ({
      name: c.party,
      votes: c.votes,
      color: c.color,
    })), [candidates]);

  const pieData = useMemo(() => candidates.map(c => ({
    name: c.party,
    value: c.votes,
    color: c.color,
  })), [candidates]);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Stats */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group border border-slate-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-110"></div>
          <div className="relative z-10">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">คะแนนเสียงบัญชีรายชื่อรวม</h3>
            <p className="text-5xl font-black text-[#1a237e] tabular-nums">
              {new Intl.NumberFormat().format(totalVotes)}
            </p>
            <p className="text-emerald-500 text-xs mt-4 font-bold flex items-center gap-2">
              <i className="fas fa-check-circle"></i>
              ยืนยันการรับคะแนนเรียลไทม์
            </p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group border border-slate-100">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-110"></div>
           <div className="relative z-10">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">จำนวนพรรคการเมือง</h3>
            <p className="text-5xl font-black text-[#1a237e] tabular-nums">{candidates.length}</p>
            <p className="text-amber-600 text-xs mt-4 font-bold">พรรคที่ลงทะเบียนในระบบ</p>
          </div>
        </div>

        <div className="bg-[#1a237e] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border-none">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-110"></div>
           <div className="relative z-10">
            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">ผู้นำอันดับ 1</h3>
            <p className="text-3xl font-black text-amber-400 truncate">
              {chartData[0]?.name || 'ไม่มีข้อมูล'}
            </p>
            <p className="text-white/60 text-xs mt-4 font-bold uppercase tracking-widest">
              ได้คะแนนเสียงสูงสุดขณะนี้
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-800">
            <div className="w-2 h-10 bg-amber-500 rounded-full"></div>
            คะแนนยอดนิยม (Top 5)
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12} 
                  tick={{fill: '#1e293b', fontWeight: 'bold'}} 
                  width={120}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }}
                />
                <Bar dataKey="votes" radius={[0, 10, 10, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-800">
            <div className="w-2 h-10 bg-indigo-500 rounded-full"></div>
            สัดส่วนคะแนนเสียงทั้งหมด
          </h3>
          <div className="h-[400px]">
            {candidates.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={130}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 'bold', paddingTop: '20px'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <i className="fas fa-chart-pie text-6xl mb-4 opacity-20"></i>
                <p className="font-bold">รอการเชื่อมต่อข้อมูลคะแนน</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
