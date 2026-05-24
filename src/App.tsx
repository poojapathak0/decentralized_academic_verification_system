import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useUIStore } from '@/store/uiStore'
import { Navbar } from '@/components/layout/Navbar'
import { WalletConnectModal } from '@/components/shared/WalletConnectModal'
import { HomePage } from '@/pages/HomePage'
import { VerifierPage } from '@/features/verifier/VerifierPage'
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage'
import { StudentDashboardPage } from '@/features/student/StudentDashboardPage'

function App() {
  const { isDarkMode } = useUIStore()

  useEffect(() => {
    // Apply dark mode on mount
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [isDarkMode])

  return (
    <Router>
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-white dark:bg-accent-900 text-accent-900 dark:text-white transition-colors">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/verify" element={<VerifierPage />} />
              <Route path="/verify/:certificateId" element={<VerifierPage />} />
              <Route path="/dashboard" element={<StudentDashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/settings" element={<Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <WalletConnectModal />
          <Toaster position="bottom-right" />
        </div>
      </div>
    </Router>
  )
}

export default App
