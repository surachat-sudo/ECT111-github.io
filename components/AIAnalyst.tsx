
import React, { useState, useRef, useEffect } from 'react';
import { getElectionAnalysis } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIAnalyst: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "สวัสดีครับ ผมคือระบบวิเคราะห์ข้อมูลการเลือกตั้งอัจฉริยะ ผมสามารถช่วยคุณเปรียบเทียบนโยบายพรรคการเมือง อธิบายขั้นตอนการเลือกตั้ง หรือวิเคราะห์แนวโน้มคะแนนเสียงจากข้อมูลแบบเรียลไทม์ได้ คุณอยากทราบข้อมูลส่วนไหนเป็นพิเศษไหมครับ?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getElectionAnalysis(input);
    setMessages(prev => [...prev, response]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] p-6 rounded-3xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#1a237e] text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-white/20' : 'bg-amber-400'}`}>
                   <i className={`fas ${msg.role === 'user' ? 'fa-user text-xs' : 'fa-robot text-[#1a237e] text-xs'}`}></i>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                  {msg.role === 'user' ? 'คุณ (ผู้ใช้งาน)' : 'ระบบวิเคราะห์การเลือกตั้ง'}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed font-medium">{msg.content}</p>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <i className="fas fa-search text-[8px]"></i>
                    แหล่งอ้างอิงข้อมูล:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-all flex items-center gap-2 border border-slate-200"
                      >
                        <i className="fas fa-link text-[8px]"></i>
                        {source.title.substring(0, 40)}...
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-200 p-6 rounded-3xl rounded-tl-none flex items-center gap-4">
               <div className="flex gap-1.5">
                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
               <span className="text-xs text-slate-400 font-bold">กำลังประมวลผลข้อมูลการเมืองล่าสุด...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="สอบถามข้อมูลนโยบาย, ผลการนับคะแนน หรือประวัติผู้สมัคร..."
          className="w-full bg-white border border-slate-200 rounded-[2rem] px-8 py-5 pr-20 shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all text-sm font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#1a237e] text-white rounded-full flex items-center justify-center hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
        >
          <i className="fas fa-paper-plane text-sm"></i>
        </button>
      </form>
    </div>
  );
};

export default AIAnalyst;
