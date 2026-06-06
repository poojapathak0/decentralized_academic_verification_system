// Certificate types
export enum CertificateStatus {
  VALID = 'valid',
  REVOKED = 'revoked',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

export interface Certificate {
  id: string
  studentId?: string
  studentAddress?: string
  studentName: string
  studentWallet?: string
  issueDate: string
  expiryDate?: string
  issuer?: string
  issuerWallet?: string
  certificateData: CertificateMetadata
  ipfsHash?: string
  qrCode?: string
  status?: CertificateStatus
  createdAt?: string
  updatedAt?: string
  // Backend API fields
  programName?: string
  graduationDate?: string
  institutionName?: string
  certificateId?: string
  blockNumber?: number
  transactionHash?: string
  isTestMode?: boolean
  hash?: string
}

export interface CertificateMetadata {
  title: string
  description: string
  institution: string
  program: string
  grade?: string
  credits?: number
  completionDate: string
  certificateImage?: string
  pdfUrl?: string
  verificationUrl?: string
}

export interface VerificationResult {
  isValid: boolean
  status: CertificateStatus
  certificate?: Certificate
  message: string
  verifiedAt: string
  verifierWallet?: string
}

// User/Auth types
export enum UserRole {
  PUBLIC = 'public',
  ADMIN = 'admin',
  STUDENT = 'student',
}

export interface User {
  id: string
  walletAddress: string
  role: UserRole
  email?: string
  name?: string
  institution?: string
  createdAt: string
}

export interface WalletConnection {
  address: string
  isConnected: boolean
  chainId: number
  balance?: string
}

export interface AuthState {
  user: User | null
  wallet: WalletConnection | null
  isAuthenticated: boolean
  role: UserRole
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, any>
  }
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// UI/Form types
export interface FormErrors {
  [key: string]: string
}

export interface IssueCertificatePayload {
  studentWallet: string
  studentName: string
  title: string
  description: string
  institution: string
  program: string
  grade?: string
  credits?: number
  completionDate: string
  expiryDate?: string
  certificateImage?: File
  pdfUrl?: string
}

export interface IssuanceResult {
  certificateId: string
  transactionHash: string
  ipfsHash?: string
  qrCode: string
  estimatedGas?: string
}

// Dashboard types
export interface DashboardStats {
  totalCertificates: number
  validCertificates: number
  revokedCertificates: number
  pendingCertificates: number
  verificationCount: number
}

export interface AdminStats extends DashboardStats {
  issuedByMe: number
  totalStudents: number
  recentIssuances: Certificate[]
}

export interface StudentStats {
  totalCertificates: number
  validCertificates: number
  sharedCount: number
  recentCertificates: Certificate[]
}
