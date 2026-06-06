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
    setIsLoading(true)
    
    // Use test admin address if wallet is not connected (for demo/testing)
    const adminAddress = wallet?.address || '0xe54275B5142200caEe678788362C4328D6D1dCB2'
    
    try {
      const [statsRes, certsRes] = await Promise.all([
        api.admin.getDashboardStats(adminAddress),
        api.admin.listCertificates(adminAddress),
      ])

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data)
      } else if (!statsRes.success) {
        console.error('Dashboard stats error:', statsRes.error)
        toast.error(statsRes.error?.message || 'Failed to load dashboard stats')
      }

      if (certsRes.success && certsRes.data) {
        setCertificates(certsRes.data.data)
      } else if (!certsRes.success) {
        console.error('Certificates error:', certsRes.error)
        toast.error(certsRes.error?.message || 'Failed to load certificates')
      }
    } catch (error) {
      console.error('Dashboard loading error:', error)
      toast.error('Failed to load dashboard data')
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
                              {cert.certificateData?.title || cert.certificateId}
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
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    studentWallet: '',
    studentName: '',
    title: '',
    description: '',
    institution: '',
    program: '',
    grade: '',
    credits: 120,
    completionDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().getFullYear() + 4, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0],
    pdfUrl: '',
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCertificateFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      toast.success(`File selected: ${file.name}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.studentWallet.startsWith('0x')) {
      toast.error('Invalid wallet address. Must start with 0x')
      return
    }

    setIsLoading(true)

    try {
      // FIXED: Actually upload file to IPFS via backend
      let ipfsHash = ''
      if (certificateFile) {
        const loadingToast = toast.loading('Uploading certificate to IPFS via Pinata...')
        try {
          const formDataToSend = new FormData()
          formDataToSend.append('file', certificateFile)

          const uploadResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`,
            {
              method: 'POST',
              body: formDataToSend,
            }
          )

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json()
            throw new Error(errorData.message || 'Failed to upload file to IPFS')
          }

          const uploadData = await uploadResponse.json()
          ipfsHash = uploadData.ipfsHash

          if (!ipfsHash) {
            throw new Error('No IPFS hash returned from upload')
          }

          toast.dismiss(loadingToast)
          toast.success(`File uploaded to IPFS: ${ipfsHash.substring(0, 10)}...`)
        } catch (uploadError) {
          toast.dismiss(loadingToast)
          const msg = uploadError instanceof Error ? uploadError.message : 'Upload failed'
          toast.error(`Failed to upload file: ${msg}`)
          throw uploadError
        }
      }

      // Issue certificate with IPFS hash
      const result = await api.admin.issue({
        ...formData,
        pdfUrl: ipfsHash || '',
        credits: parseInt(formData.credits.toString()) || 120,
      })

      if (result.success) {
        toast.success('Certificate issued successfully!')
        setCertificateFile(null)
        setFilePreview(null)
        onSuccess()
      } else {
        const errorMessage = result.error?.message || 'Failed to issue certificate'
        console.error('Certificate issuance failed:', {
          error: result.error,
          response: result,
        })
        toast.error(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error issuing certificate'
      console.error('Certificate issuance error:', error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-accent-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-accent-200 dark:border-accent-700 flex justify-between items-center sticky top-0 bg-white dark:bg-accent-800">
          <h2 className="text-2xl font-bold text-accent-900 dark:text-white">
            Issue New Certificate
          </h2>
          <button
            onClick={onClose}
            className="text-accent-500 hover:text-accent-700 dark:hover:text-accent-300 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4">
              📋 Student Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Student Name *"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="col-span-2 px-4 py-3 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Student Wallet Address (0x...) *"
                value={formData.studentWallet}
                onChange={(e) => setFormData({ ...formData, studentWallet: e.target.value })}
                className="col-span-2 px-4 py-3 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Certificate Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4">
              🎓 Certificate Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Certificate Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-2 px-4 py-3 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Description (e.g., Degree earned with distinction)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-2 px-4 py-3 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              <input
                type="text"
                placeholder="Program/Degree *"
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="px-4 py-3 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Institution Name *"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="px-4 py-3 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Grade (e.g., A, A+, B)"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="px-4 py-3 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Credits"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 120 })}
                className="px-4 py-3 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dates Section */}
          <div>
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4">
              📅 Dates
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Completion Date *
                </label>
                <input
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                  className="w-full px-4 py-3 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-3 border border-accent-300 dark:border-accent-600 rounded-lg dark:bg-accent-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div>
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4">
              📄 Certificate File (PDF/Image)
            </h3>
            <div className="border-2 border-dashed border-accent-300 dark:border-accent-600 rounded-lg p-6">
              <input
                type="file"
                id="certificate-file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.gif"
                className="hidden"
              />
              <label
                htmlFor="certificate-file"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">📤</div>
                  <p className="text-accent-900 dark:text-white font-medium">
                    {certificateFile ? certificateFile.name : 'Click to upload certificate'}
                  </p>
                  <p className="text-accent-600 dark:text-accent-400 text-sm mt-1">
                    Supported: PDF, PNG, JPG, GIF (Optional)
                  </p>
                </div>
              </label>
            </div>
            {filePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Preview:
                </p>
                {certificateFile?.type.startsWith('image/') ? (
                  <img src={filePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg" />
                ) : (
                  <div className="bg-accent-100 dark:bg-accent-700 p-4 rounded-lg text-accent-900 dark:text-white">
                    📄 PDF File: {certificateFile?.name}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-accent-200 dark:border-accent-700">
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
