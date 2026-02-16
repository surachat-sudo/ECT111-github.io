
export interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  color: string;
  image: string;
  description: string;
  keyPolicies: string[];
}

export interface ElectionResult {
  region: string;
  winner: string;
  margin: number;
  electoralVotes: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: Array<{ title: string; uri: string }>;
}

export interface UserAccount {
  username: string;
  password?: string;
  status: 'pending' | 'approved';
  role: 'admin';
  requestDate: string;
}

export interface AdminSettings {
  authSheetUrl: string; // สำหรับ Login (Admin User, Password)
  voteSheetUrl: string; // สำหรับคะแนน (ชื่อพรรค, คะแนน, แคนดิเดต)
  syncScriptUrl: string; 
  parties: ManagedParty[];
  accounts: UserAccount[];
}

export interface ManagedParty {
  id: string;
  name: string;
  candidateName: string;
  image: string;
  color: string;
}
