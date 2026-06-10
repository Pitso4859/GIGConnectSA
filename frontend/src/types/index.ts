export type Role = 'WORKER' | 'CLIENT' | 'ADMIN';
export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'AWAITING_APPROVAL' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
export type TxType = 'CREDIT' | 'DEBIT' | 'ESCROW' | 'RELEASE' | 'REFUND';
export type MessageRole = 'USER' | 'ASSISTANT';
export type Badge = 'ELITE' | 'GOLD' | 'SILVER' | 'BRONZE' | 'NEWCOMER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  isVerified: boolean;
  createdAt: string;
  averageRating?: number;
  totalJobsCompleted?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Job {
  id: string;
  client: User;
  worker?: User;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  budget: number;
  status: JobStatus;
  requiredSkills?: string;
  proofImageUrl?: string;
  postedAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  description: string;
  createdAt: string;
}

export interface WalletData {
  id: string;
  balance: number;
  updatedAt: string;
  transactions: Transaction[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  averageRating: number;
  totalRatings: number;
  totalJobsCompleted: number;
  badge: Badge;
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  createdAt: string;
}
