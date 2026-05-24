import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Container, PageHeader } from '@/components/layout/Container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { CertificateCard } from '@/components/shared/CertificateCard'
import { Certificate, AdminStats } from '@/types'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export function AdminDashboardPage() {
  const { wallet } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showIssueModal, setShowIssueModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [wallet])

  const loadData = async () => {
    if (!wallet) return

    setIsLoading(true)
    try {
      const [statsRes, certsRes] = await Promise.all([
        api.admin.getDashboardStats(wallet.address),
        api.admin.listCertificates(wallet.address),
      ])

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data)
      }

      if (certsRes.success && certsRes.data) {
        setCertificates(certsRes.data.data)
      }
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white dark:from-accent-900 dark:to-accent-800 py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <PageHeader
              title="Admin Dashboard"
              description="Manage and issue academic credentials"
            />
            <Button
              onClick={() => setShowIssueModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Issue Certificate
            </Button>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Issued"
                  value={stats.totalCertificates}
                  icon={FileText}
                  color="blue"
                />
                <StatCard
                  title="Valid"
                  value={stats.validCertificates}
                  icon={CheckCircle}
                  color="green"
                />
                <StatCard
                  title="Revoked"
                  value={stats.revokedCertificates}
                  icon={AlertCircle}
                  color="red"
                />
                <StatCard
                  title="Total Students"
                  value={stats.totalStudents}
                  icon={BarChart3}
                  color="purple"
                />
              </div>
            )}

            {/* Recent Issuances */}
            {stats && stats.recentIssuances.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Issuances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentIssuances.map((cert, idx) => (
                        <motion.div
                          key={cert.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-4 bg-accent-50 dark:bg-accent-700 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-600 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-accent-900 dark:text-white">
                              {cert.certificateData.title}
                            </p>
                            <p className="text-sm text-accent-600 dark:text-accent-400">
                              {cert.studentName}
                            </p>
                          </div>
                          <Badge variant="success">Issued</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="certificates">
            {/* Certificates Grid */}
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert, idx) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <CertificateCard
                      certificate={cert}
                      showActions={true}
                      onRevoke={async (c) => {
                        try {
                          await api.admin.revoke(c.id)
                          toast.success('Certificate revoked successfully')
                          await loadData()
                        } catch (error) {
                          toast.error('Failed to revoke certificate')
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-accent-400 mx-auto mb-4 opacity-50" />
                  <p className="text-accent-600 dark:text-accent-400">
                    No certificates issued yet
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-accent-700 dark:text-accent-300">
                  <p>Additional settings and configurations will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Issue Certificate Modal */}
        {showIssueModal && (
          <IssueCertificateModal
            onClose={() => setShowIssueModal(false)}
            onSuccess={() => {
              setShowIssueModal(false)
              loadData()
            }}
          />
        )}
      </Container>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: number
  icon: any
  color: 'blue' | 'green' | 'red' | 'purple'
}) {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardContent className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-accent-600 dark:text-accent-400">{title}</p>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function IssueCertificateModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    studentWallet: '',
    studentName: '',
    title: '',
    description: '',
    institution: '',
    program: '',
    grade: '',
    completionDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await api.admin.issue({
        ...formData,
        credits: formData.grade ? 120 : undefined,
      })

      if (result.success) {
        toast.success('Certificate issued successfully!')
        onSuccess()
      } else {
        toast.error('Failed to issue certificate')
      }
    } catch (error) {
      toast.error('Error issuing certificate')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-accent-800 rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto"
      >
        <div className="p-6 border-b border-accent-200 dark:border-accent-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-accent-900 dark:text-white">
            Issue New Certificate
          </h2>
          <button
            onClick={onClose}
            className="text-accent-500 hover:text-accent-700 dark:hover:text-accent-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Student Wallet"
              value={formData.studentWallet}
              onChange={(e) => setFormData({ ...formData, studentWallet: e.target.value })}
              className="col-span-2 px-4 py-2 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className="col-span-2 px-4 py-2 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Program"
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              className="px-4 py-2 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Institution"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="px-4 py-2 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Grade (optional)"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="px-4 py-2 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Issue Certificate
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
