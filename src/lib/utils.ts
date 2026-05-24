import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Certificate, CertificateStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatStatus(status: CertificateStatus): {
  label: string
  color: string
  className: string
} {
  switch (status) {
    case CertificateStatus.VALID:
      return {
        label: 'Valid',
        color: 'green',
        className: 'bg-green-100 text-green-800 border-green-300',
      }
    case CertificateStatus.REVOKED:
      return {
        label: 'Revoked',
        color: 'red',
        className: 'bg-red-100 text-red-800 border-red-300',
      }
    case CertificateStatus.PENDING:
      return {
        label: 'Pending',
        color: 'yellow',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      }
    case CertificateStatus.EXPIRED:
      return {
        label: 'Expired',
        color: 'gray',
        className: 'bg-gray-100 text-gray-800 border-gray-300',
      }
    default:
      return {
        label: 'Unknown',
        color: 'gray',
        className: 'bg-gray-100 text-gray-800 border-gray-300',
      }
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function certificateToCSV(certificates: Certificate[]): string {
  if (certificates.length === 0) return ''

  const headers = [
    'Certificate ID',
    'Student Name',
    'Student Wallet',
    'Program',
    'Institution',
    'Issue Date',
    'Status',
  ]

  const rows = certificates.map((cert) => [
    cert.id,
    cert.studentName,
    cert.studentWallet,
    cert.certificateData.program,
    cert.certificateData.institution,
    formatDate(cert.issueDate),
    cert.status,
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  return csvContent
}

export function downloadAsFile(content: string, filename: string, type = 'text/plain') {
  const element = document.createElement('a')
  element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateMockCertificateId(): string {
  return `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function isExpired(certificate: Certificate): boolean {
  if (!certificate.expiryDate) return false
  return new Date(certificate.expiryDate) < new Date()
}
