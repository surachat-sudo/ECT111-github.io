
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// // Fix: Use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getElectionAnalysis = async (query: string): Promise<ChatMessage> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `คุณคือนักวิเคราะห์การเมืองไทยผู้เชี่ยวชาญ (สวมบทบาทนักวิเคราะห์จาก กกต.) 
        ให้ข้อมูลเชิงลึกที่เป็นกลางเกี่ยวกับกฎหมายการเลือกตั้งของไทย (ส.ส. แบบแบ่งเขตและบัญชีรายชื่อ), 
        วิเคราะห์นโยบายของพรรคการเมืองไทย, และประวัติผู้สมัครโดยอ้างอิงจากข้อมูลจริง 
        ต้องตอบเป็นภาษาไทยที่เป็นทางการแต่อ่านง่าย 
        หากใช้ Google Search ต้องระบุแหล่งที่มา (เช่น มติชน, ไทยรัฐ, กกต.) เสมอ`,
      },
    });

    // // Fix: Correctly extract web sources from grounding chunks for search grounding
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'แหล่งข้อมูลอ้างอิง',
      uri: chunk.web?.uri || '',
    })).filter((s: any) => s.uri) || [];

    return {
      role: 'model',
      // // Fix: Access response.text property directly (not a method)
      content: response.text || 'ขออภัยครับ ไม่สามารถสร้างบทวิเคราะห์ได้ในขณะนี้',
      sources: sources,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      role: 'model',
      content: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูลอัจฉริยะ กรุณาลองใหม่อีกครั้ง",
    };
  }
};

export const getLatestElectionNews = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "สรุปข่าวการเลือกตั้งไทยที่สำคัญที่สุด 3 ข่าวในรอบ 24 ชั่วโมงที่ผ่านมา",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    // // Fix: Access response.text property directly
    return response.text || "ไม่พบสรุปข่าวในขณะนี้";
  } catch (error) {
    return "ไม่สามารถดึงข่าวล่าสุดได้";
  }
};
