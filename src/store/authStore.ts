import { create } from 'zustand'
import { User, UserRole, WalletConnection } from '@/types'

interface AuthState {
  user: User | null
  wallet: WalletConnection | null
  isAuthenticated: boolean
  role: UserRole
  isConnecting: boolean
  setUser: (user: User | null) => void
  setWallet: (wallet: WalletConnection | null) => void
  setRole: (role: UserRole) => void
  setIsConnecting: (isConnecting: boolean) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  disconnect: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  wallet: null,
  isAuthenticated: false,
  role: UserRole.PUBLIC,
  isConnecting: false,
  setUser: (user) => set({ user }),
  setWallet: (wallet) => set({ wallet }),
  setRole: (role) => set({ role }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  disconnect: () =>
    set({
      user: null,
      wallet: null,
      isAuthenticated: false,
      role: UserRole.PUBLIC,
    }),
}))
