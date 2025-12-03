export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface EmbeddingStats {
  totalDocuments: number;
  totalChunks: number;
  lastUpdated: string;
  diskUsageMB: number;
}