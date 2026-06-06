import { useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Container, PageHeader } from '@/components/layout/Container'
import { Card, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { CertificateStatus, VerificationResult } from '@/types'
import { api } from '@/lib/api'
import { formatDate, formatStatus, truncateAddress } from '@/lib/utils'
import toast from 'react-hot-toast'

export function VerifierPage() {
  const [certificateId, setCertificateId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID')
      return
    }

    setIsLoading(true)
    try {
      const result = await api.certificates.verify(certificateId)
      if (result.success) {
        setVerificationResult(result.data || null)
      } else {
        toast.error(result.error?.message || 'Verification failed')
        setVerificationResult(null)
      }
    } catch (error) {
      toast.error('Error during verification')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-accent-900 dark:to-accent-800">
      <Container className="py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <PageHeader
            title="Verify Academic Credentials"
            description="Instantly verify the authenticity of academic credentials issued through our system"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Verification Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="sticky top-24">
              <CardTitle className="mb-6">Enter Certificate Details</CardTitle>

              <form onSubmit={handleVerify} className="space-y-6">
                {/* Certificate ID Input */}
                <div>
                  <label className="block text-sm font-medium text-accent-900 dark:text-white mb-2">
                    Certificate ID
                  </label>
                  <Input
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="e.g., CERT-1234567890"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-accent-500 dark:text-accent-400 mt-2">
                    Try: cert-001
                  </p>
                </div>

                {/* QR Code Info */}
                <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-4 flex items-start gap-3">
                  <QrCode className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-primary-700 dark:text-primary-200">
                    <p className="font-medium mb-1">Scan QR Code</p>
                    <p>You can also scan a certificate's QR code to verify it instantly.</p>
                  </div>
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Verify Certificate
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Right Side - Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isLoading ? (
              <Card className="flex items-center justify-center min-h-96">
                <LoadingSpinner text="Verifying..." />
              </Card>
            ) : verificationResult ? (
              <VerificationResultCard result={verificationResult} />
            ) : (
              <Card className="flex items-center justify-center min-h-96 border-2 border-dashed border-accent-300 dark:border-accent-600">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent-100 dark:bg-accent-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                  </div>
                  <p className="text-accent-600 dark:text-accent-400 font-medium">
                    Enter a certificate ID to verify
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </Container>
    </div>
  )
}

function VerificationResultCard({ result }: { result: VerificationResult }) {
  const isValid = result.status === CertificateStatus.VALID
  const statusInfo = formatStatus(result.status)
  const cert = result.certificate

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className={`border-2 ${statusInfo.className}`}>
        {/* Status Header */}
        <div className="flex items-center gap-4 mb-6">
          {isValid ? (
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          ) : result.status === CertificateStatus.REVOKED ? (
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-accent-900 dark:text-white">
              {isValid ? 'Certificate Valid' : 'Certificate Invalid'}
            </h3>
            <Badge variant={statusInfo.color as any}>{statusInfo.label}</Badge>
          </div>
        </div>

        {/* Message */}
        <p className="text-accent-700 dark:text-accent-300 mb-6 pb-6 border-b border-accent-200 dark:border-accent-700">
          {result.message}
        </p>

        {/* Certificate Details */}
        {cert && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-bold text-accent-900 dark:text-white mb-4">Certificate Details</h4>

            <DetailRow label="Title" value={cert.certificateData?.title || 'Certificate'} />
            <DetailRow label="Student" value={cert.studentName} />
            <DetailRow label="Institution" value={cert.certificateData?.institution || 'N/A'} />
            <DetailRow label="Program" value={cert.certificateData?.program || 'N/A'} />
            <DetailRow label="Issue Date" value={formatDate(cert.issueDate)} />
            {cert.expiryDate && (
              <DetailRow label="Expiry Date" value={formatDate(cert.expiryDate)} />
            )}
            {cert.certificateData?.grade && (
              <DetailRow label="Grade" value={cert.certificateData.grade} />
            )}
            <DetailRow
              label="Issuer"
              value={truncateAddress(cert.issuerWallet || 'Unknown')}
              mono
            />
            <DetailRow
              label="Student Wallet"
              value={truncateAddress(cert.studentWallet || cert.studentAddress || 'Unknown')}
              mono
            />

            {cert.ipfsHash && (
              <DetailRow label="IPFS Hash" value={truncateAddress(cert.ipfsHash)} mono />
            )}
          </motion.div>
        )}

        {/* Verification Footer */}
        <div className="mt-6 pt-6 border-t border-accent-200 dark:border-accent-700 text-xs text-accent-500 dark:text-accent-400">
          <p>Verified at: {new Date(result.verifiedAt).toLocaleString()}</p>
        </div>
      </Card>
    </motion.div>
  )
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-accent-600 dark:text-accent-400 text-sm">{label}:</span>
      <span className={`text-accent-900 dark:text-white text-sm font-medium text-right ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  )
}
