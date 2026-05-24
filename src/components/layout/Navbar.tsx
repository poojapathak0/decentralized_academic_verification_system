import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

export function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { user, wallet, isAuthenticated, disconnect } = useAuthStore()
  const { isDarkMode, toggleDarkMode, setShowWalletModal } = useUIStore()

  const handleLogout = () => {
    disconnect()
    navigate('/')
  }

  const menuItems = [
    { label: 'Verify', href: '/verify' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <nav className="bg-white dark:bg-accent-800 border-b border-accent-200 dark:border-accent-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white font-bold group-hover:shadow-lg transition-shadow">
              ✓
            </div>
            <span className="text-xl font-bold text-accent-900 dark:text-white">
              ACV
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-accent-600 dark:text-accent-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-accent-100 dark:hover:bg-accent-700 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              ) : (
                <Moon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              )}
            </button>

            {/* Auth Section */}
            {isAuthenticated && wallet ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-accent-900 dark:text-white">
                    {user?.name || 'Connected'}
                  </p>
                  <p className="text-xs text-accent-500 dark:text-accent-400">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowWalletModal(true)}
                className="hidden sm:inline-flex"
              >
                Connect Wallet
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-accent-100 dark:hover:bg-accent-700 rounded-lg transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 border-t border-accent-200 dark:border-accent-700"
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-4 py-2 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Button
                size="sm"
                onClick={() => {
                  setShowWalletModal(true)
                  setIsOpen(false)
                }}
                className="m-4"
              >
                Connect Wallet
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
