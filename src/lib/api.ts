import {
  Certificate,
  VerificationResult,
  User,
  UserRole,
  WalletConnection,
  ApiResponse,
  PaginatedResponse,
  IssueCertificatePayload,
  IssuanceResult,
  AdminStats,
  CertificateStatus,
} from '@/types'

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api'

// Type extension for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>
    }
  }
}

// Helper function for API calls
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      // Extract error from backend response or create one
      const error = data.error || {
        code: response.status.toString(),
        message: data.message || 'API request failed',
      }
      
      return {
        success: false,
        error,
        timestamp: new Date().toISOString(),
      }
    }

    return {
      success: true,
      data: data.data || data,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error occurred',
      },
      timestamp: new Date().toISOString(),
    }
  }
}

// API functions for authentication
export const authApi = {
  async connectWallet(address?: string): Promise<ApiResponse<WalletConnection>> {
    // Client-side wallet connection (MetaMask or demo mode)
    try {
      let walletAddress = address

      // Try MetaMask if available and no address provided
      if (!address && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          walletAddress = accounts[0]
        } catch (error) {
          console.warn('MetaMask connection failed, continuing in demo mode')
        }
      }

      // If still no address, we're in demo mode but should have received an address
      if (!walletAddress) {
        return {
          success: false,
          error: {
            code: 'NO_ADDRESS',
            message: 'Wallet address is required',
          },
          timestamp: new Date().toISOString(),
        }
      }

      return {
        success: true,
        data: {
          address: walletAddress,
          isConnected: true,
          chainId: 80002, // Polygon Amoy
          balance: '0',
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'WALLET_ERROR',
          message: error instanceof Error ? error.message : 'Wallet connection failed',
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  async disconnectWallet(): Promise<ApiResponse<null>> {
    return {
      success: true,
      data: null,
      timestamp: new Date().toISOString(),
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    // This would typically come from the backend after wallet authentication
    return {
      success: true,
      data: {
        id: 'user-' + Date.now(),
        walletAddress: '0x1234567890123456789012345678901234567890',
        role: UserRole.STUDENT,
        name: 'User',
        email: 'user@example.com',
        createdAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    }
  },
}

// API functions for certificates
export const certificateApi = {
  async verify(certificateId: string): Promise<ApiResponse<VerificationResult>> {
    const response = await fetchAPI<any>(`/certificates/verify/${certificateId}`)
    
    // FIXED: Transform backend response to match frontend VerificationResult type
    if (response.success && response.data) {
      const { certificate, isValid } = response.data
      
      let status: CertificateStatus = CertificateStatus.VALID
      let message = 'Certificate is valid and hasn\'t been revoked.'
      
      if (certificate?.isRevoked) {
        status = CertificateStatus.REVOKED
        message = 'This certificate has been revoked and is no longer valid.'
      } else if (!isValid) {
        status = CertificateStatus.REVOKED
        message = 'Certificate not found or is invalid.'
      }
      
      response.data = {
        status,
        certificate: {
          id: certificate?.certificateId || certificateId,
          studentName: certificate?.studentName || 'Unknown',
          issueDate: new Date(certificate?.issueDate * 1000 || Date.now()).toISOString(),
          expiryDate: certificate?.graduationDate,
          certificateData: {
            title: certificate?.certificateId || 'Certificate',
            description: certificate?.programName || '',
            institution: certificate?.institutionName || '',
            program: certificate?.programName || '',
            completionDate: certificate?.graduationDate || '',
          },
          status,
        },
        message,
      } as VerificationResult
    }
    
    return response
  },

  async verifyByQRCode(qrCodeData: string): Promise<ApiResponse<VerificationResult>> {
    // Extract certificate ID from QR code data
    const certificateId = qrCodeData.split('/').pop() || ''
    return certificateApi.verify(certificateId)
  },

  async getByStudent(
    studentWallet: string,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<PaginatedResponse<Certificate>>> {
    // FIX: Properly pass address query parameter
    const response = await fetchAPI<PaginatedResponse<Certificate>>(
      `/certificates/my?address=${encodeURIComponent(studentWallet)}&page=${page}&pageSize=${pageSize}`
    )
    
    // Map data if needed
    if (response.success && response.data?.data) {
      response.data.data = response.data.data.map((cert: any) => ({
        ...cert,
        status: cert.isRevoked ? 'revoked' : 'valid',
      }))
    }
    
    return response
  },

  async getById(certificateId: string): Promise<ApiResponse<Certificate>> {
    return fetchAPI<Certificate>(`/certificates/${certificateId}`)
  },

  async download(certificateId: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return {
      success: true,
      data: {
        downloadUrl: `${API_URL}/certificates/${certificateId}/download`,
      },
      timestamp: new Date().toISOString(),
    }
  },
}

// API functions for admin
export const adminApi = {
  async issue(payload: IssueCertificatePayload): Promise<ApiResponse<IssuanceResult>> {
    // FIXED: Use IPFS hash directly (upload already done on frontend)
    // Generate unique certificate ID if not provided
    const certificateId = payload.pdfUrl || `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return fetchAPI<IssuanceResult>('/certificates/issue', {
      method: 'POST',
      body: JSON.stringify({
        studentAddress: payload.studentWallet,
        ipfsHash: payload.pdfUrl || 'QmPlaceholder', // IPFS hash from Pinata upload
        studentName: payload.studentName,
        programName: payload.program,
        graduationDate: payload.completionDate,
        institutionName: payload.institution,
        certificateId: certificateId,
      }),
    })
  },

  async uploadCertificatePDF(_filePath: string): Promise<string> {
    // This function is deprecated - upload now happens in frontend before api.admin.issue()
    console.warn('uploadCertificatePDF is deprecated. Use frontend file upload instead.')
    return ''
  },

  async revoke(certificateId: string): Promise<ApiResponse<{ revokeTransactionHash: string }>> {
    return fetchAPI<{ revokeTransactionHash: string }>('/certificates/revoke', {
      method: 'POST',
      body: JSON.stringify({ certificateId }),
    })
  },

  async listCertificates(
    issuerWallet: string,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<PaginatedResponse<Certificate>>> {
    const response = await fetchAPI<any>(
      `/certificates/admin/all?address=${issuerWallet}&page=${page}&pageSize=${pageSize}`
    )
    
    if (response.success && response.data) {
      // Transform API response to match Certificate type
      response.data.data = response.data.data.map((cert: any) => ({
        ...cert,
        studentId: cert.studentAddress,
        studentWallet: cert.studentAddress,
        issuer: 'Institution',
        certificateData: {
          title: cert.certificateId || 'Certificate',
          description: `${cert.programName} from ${cert.institutionName}`,
          institution: cert.institutionName,
          program: cert.programName,
          completionDate: cert.graduationDate,
        },
        status: cert.isRevoked ? 'revoked' : 'valid',
      }))
    }
    
    return response
  },

  async getDashboardStats(adminWallet: string): Promise<ApiResponse<AdminStats>> {
    return fetchAPI<AdminStats>(`/certificates/admin/stats?address=${adminWallet}`)
  },
}

// Utility functions
export const qrCodeApi = {
  generateQRCode(data: string): Promise<string> {
    return Promise.resolve(
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`
    )
  },

  generateCertificateQRCode(certificateId: string): Promise<string> {
    const certUrl = `${window.location.origin}/verify/${certificateId}`
    return this.generateQRCode(certUrl)
  },
}

// Main API export
export const api = {
  auth: authApi,
  certificates: certificateApi,
  admin: adminApi,
  qrCode: qrCodeApi,
}
