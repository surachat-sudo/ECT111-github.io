
import { Candidate, ElectionResult } from './types';

// ลบ Candidate เริ่มต้นออกเพื่อให้ผู้ใช้ตั้งค่าเองผ่าน Admin หรือ Google Sheet
export const CANDIDATES: Candidate[] = [];

export const REGION_RESULTS: ElectionResult[] = [
  { region: 'กรุงเทพมหานคร', winner: 'รอผลคะแนน', margin: 0, electoralVotes: 33 },
  { region: 'เชียงใหม่', winner: 'รอผลคะแนน', margin: 0, electoralVotes: 10 },
  { region: 'นครราชสีมา', winner: 'รอผลคะแนน', margin: 0, electoralVotes: 16 },
  { region: 'ขอนแก่น', winner: 'รอผลคะแนน', margin: 0, electoralVotes: 11 },
  { region: 'ชลบุรี', winner: 'รอผลคะแนน', margin: 0, electoralVotes: 10 },
  { region: 'สงขลา', winner: 'รอผลคะแนน', margin: 0, electoralVotes: 9 },
  { region: 'อุบลราชธานี', winner: 'รอผลคะแนน', margin: 0, electoralVotes: 11 },
  { region: 'นนทบุรี', winner: 'รอผลคะแนน', margin: 0, electoralVotes: 8 },
  { region: 'สมุทรปราการ', winner: 'รอผลคะแนน', margin: 0, electoralVotes: 8 },
  { region: 'นครศรีธรรมราช', winner: 'รอผลคะแนน', margin: 0, electoralVotes: 10 },
];
