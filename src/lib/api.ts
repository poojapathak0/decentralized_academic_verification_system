import {
  Certificate,
  CertificateStatus,
  VerificationResult,
  User,
  UserRole,
  WalletConnection,
  ApiResponse,
  PaginatedResponse,
  IssueCertificatePayload,
  IssuanceResult,
  AdminStats,
} from '@/types'

// Mock data for demo purposes
const mockCertificates: Certificate[] = [
  {
    id: 'cert-001',
    studentId: 'student-001',
    studentName: 'Alice Johnson',
    studentWallet: '0x1234567890123456789012345678901234567890',
    issueDate: '2024-01-15',
    expiryDate: '2026-01-15',
    issuer: 'MIT',
    issuerWallet: '0x0987654321098765432109876543210987654321',
    certificateData: {
      title: 'Bachelor of Science in Computer Science',
      description: 'Degree in Computer Science with Honors',
      institution: 'Massachusetts Institute of Technology',
      program: 'Computer Science',
      grade: 'A',
      credits: 120,
      completionDate: '2024-01-15',
      verificationUrl: 'https://verify.example.com/cert-001',
    },
    ipfsHash: 'QmXxxx',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=cert-001',
    status: CertificateStatus.VALID,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
]

// API functions for authentication
export const authApi = {
  async connectWallet(): Promise<ApiResponse<WalletConnection>> {
    // Mock implementation - in production, this would connect to MetaMask
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            address: '0x1234567890123456789012345678901234567890',
            isConnected: true,
            chainId: 1,
            balance: '10.5',
          },
          timestamp: new Date().toISOString(),
        })
      }, 1000)
    })
  },

  async disconnectWallet(): Promise<ApiResponse<null>> {
    return {
      success: true,
      data: null,
      timestamp: new Date().toISOString(),
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return {
      success: true,
      data: {
        id: 'user-001',
        walletAddress: '0x1234567890123456789012345678901234567890',
        role: UserRole.STUDENT,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        createdAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    }
  },
}

// API functions for certificates
export const certificateApi = {
  async verify(certificateId: string): Promise<ApiResponse<VerificationResult>> {
    const certificate = mockCertificates.find((c) => c.id === certificateId)
    const isValid = !!certificate && certificate.status === CertificateStatus.VALID

    return {
      success: true,
      data: {
        isValid,
        status: certificate?.status || CertificateStatus.PENDING,
        certificate,
        message: certificate && isValid
          ? 'Certificate is valid and has not been revoked'
          : 'Certificate not found or has been revoked',
        verifiedAt: new Date().toISOString(),
        verifierWallet: '0x1111111111111111111111111111111111111111',
      },
      timestamp: new Date().toISOString(),
    }
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
    const studentCerts = mockCertificates.filter(
      (c) => c.studentWallet.toLowerCase() === studentWallet.toLowerCase()
    )

    const startIdx = (page - 1) * pageSize
    const endIdx = startIdx + pageSize
    const paginatedCerts = studentCerts.slice(startIdx, endIdx)

    return {
      success: true,
      data: {
        data: paginatedCerts,
        total: studentCerts.length,
        page,
        pageSize,
        hasMore: endIdx < studentCerts.length,
      },
      timestamp: new Date().toISOString(),
    }
  },

  async getById(certificateId: string): Promise<ApiResponse<Certificate>> {
    const cert = mockCertificates.find((c) => c.id === certificateId)

    if (!cert) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Certificate not found',
        },
        timestamp: new Date().toISOString(),
      }
    }

    return {
      success: true,
      data: cert,
      timestamp: new Date().toISOString(),
    }
  },

  async download(certificateId: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return {
      success: true,
      data: {
        downloadUrl: `/download/${certificateId}`,
      },
      timestamp: new Date().toISOString(),
    }
  },
}

// API functions for admin
export const adminApi = {
  async issue(payload: IssueCertificatePayload): Promise<ApiResponse<IssuanceResult>> {
    const certificateId = `cert-${Date.now()}`
    const newCertificate: Certificate = {
      id: certificateId,
      studentId: `student-${Date.now()}`,
      studentName: payload.studentName,
      studentWallet: payload.studentWallet,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: payload.expiryDate,
      issuer: payload.institution,
      issuerWallet: '0x0987654321098765432109876543210987654321',
      certificateData: {
        title: payload.title,
        description: payload.description,
        institution: payload.institution,
        program: payload.program,
        grade: payload.grade,
        credits: payload.credits || 0,
        completionDate: payload.completionDate,
        pdfUrl: payload.pdfUrl,
        verificationUrl: `https://verify.example.com/${certificateId}`,
      },
      ipfsHash: `QmHash${Date.now()}`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${certificateId}`,
      status: CertificateStatus.VALID,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockCertificates.push(newCertificate)

    return {
      success: true,
      data: {
        certificateId,
        transactionHash: `0xHash${Date.now()}`,
        ipfsHash: newCertificate.ipfsHash || '',
        qrCode: newCertificate.qrCode || '',
      },
      timestamp: new Date().toISOString(),
    }
  },

  async revoke(certificateId: string): Promise<ApiResponse<{ revokeTransactionHash: string }>> {
    const cert = mockCertificates.find((c) => c.id === certificateId)
    if (cert) {
      cert.status = CertificateStatus.REVOKED
      cert.updatedAt = new Date().toISOString()
    }

    return {
      success: true,
      data: {
        revokeTransactionHash: `0xRevoke${Date.now()}`,
      },
      timestamp: new Date().toISOString(),
    }
  },

  async listCertificates(
    issuerWallet: string,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<PaginatedResponse<Certificate>>> {
    const issuerCerts = mockCertificates.filter(
      (c) => c.issuerWallet.toLowerCase() === issuerWallet.toLowerCase()
    )

    const startIdx = (page - 1) * pageSize
    const endIdx = startIdx + pageSize
    const paginatedCerts = issuerCerts.slice(startIdx, endIdx)

    return {
      success: true,
      data: {
        data: paginatedCerts,
        total: issuerCerts.length,
        page,
        pageSize,
        hasMore: endIdx < issuerCerts.length,
      },
      timestamp: new Date().toISOString(),
    }
  },

  async getDashboardStats(adminWallet: string): Promise<ApiResponse<AdminStats>> {
    const adminCerts = mockCertificates.filter(
      (c) => c.issuerWallet.toLowerCase() === adminWallet.toLowerCase()
    )

    return {
      success: true,
      data: {
        totalCertificates: adminCerts.length,
        validCertificates: adminCerts.filter((c) => c.status === CertificateStatus.VALID).length,
        revokedCertificates: adminCerts.filter((c) => c.status === CertificateStatus.REVOKED)
          .length,
        pendingCertificates: adminCerts.filter((c) => c.status === CertificateStatus.PENDING)
          .length,
        verificationCount: Math.floor(Math.random() * 1000),
        issuedByMe: adminCerts.length,
        totalStudents: new Set(adminCerts.map((c) => c.studentId)).size,
        recentIssuances: adminCerts.slice(0, 5),
      },
      timestamp: new Date().toISOString(),
    }
  },
}

// Utility functions
export const qrCodeApi = {
  generateQRCode(data: string): Promise<string> {
    // In production, this would call qrcode library
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
