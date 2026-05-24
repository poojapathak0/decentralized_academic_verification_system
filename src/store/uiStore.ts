import { create } from 'zustand'

interface UIState {
  isDarkMode: boolean
  showWalletModal: boolean
  showCertificatePreviewModal: boolean
  showShareQRModal: boolean
  selectedCertificateId: string | null
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
  }>
  toggleDarkMode: () => void
  setShowWalletModal: (show: boolean) => void
  setShowCertificatePreviewModal: (show: boolean) => void
  setShowShareQRModal: (show: boolean) => void
  setSelectedCertificateId: (id: string | null) => void
  addNotification: (
    notification: Omit<UIState['notifications'][0], 'id'>
  ) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  showWalletModal: false,
  showCertificatePreviewModal: false,
  showShareQRModal: false,
  selectedCertificateId: null,
  notifications: [],
  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.isDarkMode
      localStorage.setItem('darkMode', String(newDarkMode))
      if (newDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { isDarkMode: newDarkMode }
    }),
  setShowWalletModal: (show) => set({ showWalletModal: show }),
  setShowCertificatePreviewModal: (show) => set({ showCertificatePreviewModal: show }),
  setShowShareQRModal: (show) => set({ showShareQRModal: show }),
  setSelectedCertificateId: (id) => set({ selectedCertificateId: id }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: `${Date.now()}-${Math.random()}`,
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}))
