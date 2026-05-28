import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { UserRole } from '@/types'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export function WalletConnectModal() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.PUBLIC)
  const { showWalletModal, setShowWalletModal } = useUIStore()
  const { setWallet, setIsAuthenticated, setRole, setUser, setIsConnecting } = useAuthStore()

  const handleConnect = async () => {
    if (!walletAddress.trim()) {
      toast.error('Please enter a wallet address')
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast.error('Invalid Ethereum address')
      return
    }

    setIsLoading(true)
    setIsConnecting(true)

    try {
      // Connect wallet with the provided address
      const walletResponse = await api.auth.connectWallet(walletAddress)
      if (walletResponse.success && walletResponse.data) {
        setWallet(walletResponse.data)
        setIsAuthenticated(true)
        setRole(selectedRole)

        // Get current user
        const userResponse = await api.auth.getCurrentUser()
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data)
        }

        toast.success('Wallet connected successfully!')
        setShowWalletModal(false)
        setWalletAddress('')
        
        // Navigate to appropriate dashboard based on role
        if (selectedRole === UserRole.ADMIN) {
          navigate('/admin')
        } else if (selectedRole === UserRole.STUDENT) {
          navigate('/dashboard')
        } else {
          navigate('/verify')
        }
      } else {
        toast.error(walletResponse.error?.message || 'Failed to connect wallet')
      }
    } catch (error) {
      toast.error('Failed to connect wallet')
      console.error(error)
    } finally {
      setIsLoading(false)
      setIsConnecting(false)
    }
  }

  return (
    <Modal
      isOpen={showWalletModal}
      onClose={() => setShowWalletModal(false)}
      title="Connect Wallet"
      description="Connect your Ethereum wallet to get started"
      size="md"
    >
      <div className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-accent-900 dark:text-white mb-3">
            Select Your Role (Demo)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[UserRole.PUBLIC, UserRole.ADMIN, UserRole.STUDENT].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-3 rounded-lg border-2 transition-all text-center font-medium capitalize ${
                  selectedRole === role
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'border-accent-300 dark:border-accent-600 hover:border-primary-400'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Address Input */}
        <div>
          <label className="block text-sm font-medium text-accent-900 dark:text-white mb-2">
            Wallet Address
          </label>
          <Input
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            disabled={isLoading}
          />
          <p className="text-xs text-accent-500 dark:text-accent-400 mt-2">
            For demo purposes, enter any valid Ethereum address (0x...)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => setShowWalletModal(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            isLoading={isLoading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            Connect
          </Button>
        </div>

        {/* Info */}
        <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-4 text-sm text-primary-700 dark:text-primary-200">
          <p className="font-medium mb-1">💡 Demo Mode</p>
          <p>
            This is a demo interface. In production, this would connect to MetaMask or other
            Web3 wallets.
          </p>
        </div>
      </div>
    </Modal>
  )
}
