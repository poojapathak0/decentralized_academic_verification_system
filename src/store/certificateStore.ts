import { create } from 'zustand'
import { Certificate } from '@/types'

interface CertificateState {
  certificates: Certificate[]
  isLoading: boolean
  error: string | null
  currentPage: number
  pageSize: number
  setCertificates: (certificates: Certificate[]) => void
  addCertificate: (certificate: Certificate) => void
  removeCertificate: (certificateId: string) => void
  updateCertificate: (certificate: Certificate) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  clearCertificates: () => void
}

export const useCertificateStore = create<CertificateState>((set) => ({
  certificates: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  setCertificates: (certificates) => set({ certificates }),
  addCertificate: (certificate) =>
    set((state) => ({
      certificates: [certificate, ...state.certificates],
    })),
  removeCertificate: (certificateId) =>
    set((state) => ({
      certificates: state.certificates.filter((c) => c.id !== certificateId),
    })),
  updateCertificate: (certificate) =>
    set((state) => ({
      certificates: state.certificates.map((c) => (c.id === certificate.id ? certificate : c)),
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setPageSize: (pageSize) => set({ pageSize }),
  clearCertificates: () => set({ certificates: [], error: null }),
}))
