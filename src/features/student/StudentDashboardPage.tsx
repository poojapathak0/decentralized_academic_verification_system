import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, User, FileText, CheckCircle } from 'lucide-react'
import { Container, PageHeader } from '@/components/layout/Container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { CertificateCard } from '@/components/shared/CertificateCard'
import { Certificate } from '@/types'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export function StudentDashboardPage() {
  const { wallet, user } = useAuthStore()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    loadCertificates()
  }, [wallet])

  const loadCertificates = async () => {
    setIsLoading(true)

    if (!wallet) {
      console.log('[StudentDashboard] ⚠️ No wallet connected')
      setIsLoading(false)
      return
    }

    console.log(`[StudentDashboard] 📚 Loading certificates for: ${wallet.address}`)

    try {
      const result = await api.certificates.getByStudent(wallet.address)
      console.log('[StudentDashboard] API Response:', result)

      if (result.success && result.data) {
        // FIXED: Ensure status is properly set from isRevoked flag
        const certs = result.data.data.map((cert: any) => ({
          ...cert,
          status: cert.status || (cert.isRevoked ? 'revoked' : 'valid'),
        }))
        setCertificates(certs)
        console.log(`[StudentDashboard] ✅ Loaded ${certs.length} certificates`)

        // Check for revoked certificates and notify user
        const revokedCerts = certs.filter((c: any) => c.status === 'revoked' || c.isRevoked)
        if (revokedCerts.length > 0) {
          toast.error(`⚠️ ${revokedCerts.length} certificate(s) have been revoked by your institution`)
        }
      } else {
        console.error('[StudentDashboard] API returned success=false:', result.error)
        toast.error(result.error?.message || 'Failed to load certificates')
      }
    } catch (error) {
      console.error('[StudentDashboard] Error loading certificates:', error)
      toast.error('Failed to load certificates')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (cert: Certificate) => {
    try {
      console.log(`[StudentDashboard] 📥 Downloading certificate: ${cert.id}`)
      const result = await api.certificates.download(cert.id)
      console.log('[StudentDashboard] Download response:', result)

      if (result.success && result.data) {
        console.log(`[StudentDashboard] ✅ Opening download URL: ${result.data.downloadUrl}`)
        window.open(result.data.downloadUrl, '_blank')
        toast.success('Certificate downloading...')
      } else {
        toast.error('Failed to get download URL')
      }
    } catch (error) {
      console.error('[StudentDashboard] Download error:', error)
      toast.error('Failed to download certificate')
    }
  }

  const handleShare = (cert: Certificate) => {
    setSelectedCert(cert)
    setShowShareModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your certificates..." />
      </div>
    )
  }

  const validCerts = certificates.filter((c) => c.status === 'valid')
  const totalCredits = validCerts.reduce((sum, c) => sum + (c.certificateData.credits || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white dark:from-accent-900 dark:to-accent-800 py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <PageHeader
            title="My Dashboard"
            description="View and manage your academic credentials"
          />
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-accent-600 dark:text-accent-400">
                        Total Certificates
                      </p>
                      <p className="text-2xl font-bold text-accent-900 dark:text-white">
                        {certificates.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-accent-600 dark:text-accent-400">
                        Valid Certificates
                      </p>
                      <p className="text-2xl font-bold text-accent-900 dark:text-white">
                        {validCerts.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Badge>Credits</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-accent-600 dark:text-accent-400">
                        Total Credits
                      </p>
                      <p className="text-2xl font-bold text-accent-900 dark:text-white">
                        {totalCredits}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Certificates */}
            {certificates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Certificates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {certificates.slice(0, 3).map((cert, idx) => (
                        <motion.div
                          key={cert.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-3 bg-accent-50 dark:bg-accent-700 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-600 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-accent-900 dark:text-white">
                              {cert.certificateData?.title || 'Certificate'}
                            </p>
                            <p className="text-xs text-accent-500 dark:text-accent-400">
                              {cert.certificateData?.institution || 'N/A'}
                            </p>
                          </div>
                          <Badge variant="success">Valid</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="certificates">
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
                      onDownload={handleDownload}
                      onShare={handleShare}
                      onView={(c) => {
                        setSelectedCert(c)
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
                    No certificates yet
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-accent-600 dark:text-accent-400">
                      Name
                    </label>
                    <p className="text-lg font-medium text-accent-900 dark:text-white">
                      {user?.name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-accent-600 dark:text-accent-400">
                      Email
                    </label>
                    <p className="text-lg font-medium text-accent-900 dark:text-white">
                      {user?.email || 'Not provided'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-accent-600 dark:text-accent-400">
                      Wallet Address
                    </label>
                    <p className="text-lg font-mono font-medium text-accent-900 dark:text-white break-all">
                      {wallet?.address || 'Not connected'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Share Modal */}
        {selectedCert && (
          <ShareCertificateModal
            isOpen={showShareModal}
            onClose={() => {
              setShowShareModal(false)
              setSelectedCert(null)
            }}
            certificate={selectedCert}
          />
        )}
      </Container>
    </div>
  )
}

function ShareCertificateModal({
  isOpen,
  onClose,
  certificate,
}: {
  isOpen: boolean
  onClose: () => void
  certificate: Certificate
}) {
  const certUrl = `${window.location.origin}/verify/${certificate.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(certUrl)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleShareQR = () => {
    if (certificate.qrCode) {
      window.open(certificate.qrCode, '_blank')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Certificate"
      description={`Share your ${certificate.certificateData?.title || 'certificate'} certificate`}
      size="md"
    >
      <div className="space-y-6">
        {/* Certificate Info */}
        <div className="bg-accent-50 dark:bg-accent-700 rounded-lg p-4">
          <p className="text-sm text-accent-600 dark:text-accent-400 mb-1">
            {certificate.certificateData?.title || 'Certificate'}
          </p>
          <p className="text-lg font-bold text-accent-900 dark:text-white">
            {certificate.studentName}
          </p>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          {/* Copy Link */}
          <div>
            <label className="text-sm font-medium text-accent-900 dark:text-white mb-2 block">
              Verification Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={certUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-accent-100 dark:bg-accent-800 rounded-lg text-sm font-mono text-accent-700 dark:text-accent-300 border border-accent-300 dark:border-accent-600"
              />
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                Copy
              </Button>
            </div>
          </div>

          {/* QR Code */}
          {certificate.qrCode && (
            <div>
              <label className="text-sm font-medium text-accent-900 dark:text-white mb-2 block">
                QR Code
              </label>
              <div className="bg-white p-4 rounded-lg border-2 border-accent-200 dark:border-accent-700 flex items-center justify-center">
                <img
                  src={certificate.qrCode}
                  alt="Certificate QR Code"
                  className="w-40 h-40"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleShareQR}
                className="w-full mt-3"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          )}
        </div>

        {/* Close */}
        <Button onClick={onClose} variant="secondary" className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  )
}
