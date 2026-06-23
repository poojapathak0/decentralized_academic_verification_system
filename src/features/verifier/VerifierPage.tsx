import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Search, CheckCircle, XCircle, AlertCircle, Camera, X } from 'lucide-react'
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

// ─── QR Scanner Component ────────────────────────────────────────────────────

function QRScanner({ onResult, onClose }: { onResult: (text: string) => void; onClose: () => void }) {
  const scannerRef = useRef<any>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
  mountedRef.current = true

  let scanner: any = null

  const startScanner = async () => {
    const { Html5Qrcode } = await import('html5-qrcode')

    if (!mountedRef.current) return

    scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          const parts = decodedText.split('/')
          const certId = parts[parts.length - 1] || decodedText
          scanner.stop().catch(() => {})
          onResult(certId)
        },
        () => {} // ignore errors
      )
    } catch (err) {
      // environment camera failed, try any camera
      try {
        await scanner.start(
          { facingMode: 'user' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            const parts = decodedText.split('/')
            const certId = parts[parts.length - 1] || decodedText
            scanner.stop().catch(() => {})
            onResult(certId)
          },
          () => {}
        )
      } catch (e) {
        toast.error('Could not access camera')
      }
    }
  }

  startScanner()

  return () => {
    mountedRef.current = false
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {})
      scannerRef.current.clear().catch(() => {})
    }
  }
}, [onResult])

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="relative bg-accent-900 rounded-xl p-4 mt-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 text-white bg-accent-700 hover:bg-accent-600 rounded-full p-1"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="text-white text-sm font-medium mb-3 flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Point camera at a certificate QR code
        </p>

        {/* html5-qrcode mounts into this div */}
        <div id="qr-reader" style={{ width: '100%' }} />
      </div>
    </motion.div>
  )
}

// ─── Main Verifier Page ───────────────────────────────────────────────────────

export function VerifierPage() {
  const { certificateId: urlCertId } = useParams<{ certificateId: string }>()
  const navigate = useNavigate()

  const [certificateId, setCertificateId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [showScanner, setShowScanner] = useState(false)

  // ── Core verify function (called by form submit AND url auto-fill) ──────────
  const runVerification = useCallback(async (id: string) => {
    const trimmed = id.trim()
    if (!trimmed) {
      toast.error('Please enter a certificate ID')
      return
    }

    setIsLoading(true)
    setVerificationResult(null)

    // TEMPORARY MOCK — remove before final demo
    setVerificationResult({
      isValid: true,
      status: CertificateStatus.VALID,
      message: 'Certificate is valid and has not been tampered with.',
      verifiedAt: new Date().toISOString(),
      certificate: {
        id: trimmed,
        studentName: 'Test Student',
        issuerWallet: '0xABC0000000000000000000000000000000000123',
        studentWallet: '0xDEF0000000000000000000000000000000000456',
        issueDate: '2026-01-15',
        expiryDate: undefined,
        issuer: 'Kathmandu University',
        studentId: 'stu-001',
        status: CertificateStatus.VALID,
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15',
        certificateData: {
          title: 'Bachelor of Computer Science',
          institution: 'Kathmandu University',
          program: 'B.Sc. CSIT',
          completionDate: '2026-01-15',
          description: 'Awarded for completion of B.Sc. CSIT program.',
        }
      }
    })
    setIsLoading(false)
    return
  }, [])

  // ── Auto-fill + auto-verify when URL has /verify/:certificateId ────────────
  // e.g. someone scans a QR code that links to http://localhost:5173/verify/cert-001
  useEffect(() => {
    if (urlCertId) {
      setCertificateId(urlCertId)
      runVerification(urlCertId)
    }
  }, [urlCertId, runVerification])

  // ── Form submit handler ────────────────────────────────────────────────────
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL so the result is shareable/bookmarkable
    navigate(`/verify/${certificateId.trim()}`, { replace: true })
    runVerification(certificateId)
  }

  // ── QR scanner result handler ──────────────────────────────────────────────
  const handleQRResult = useCallback((scannedId: string) => {
    setShowScanner(false)
    setCertificateId(scannedId)
    toast.success(`QR code scanned: ${scannedId}`)
    navigate(`/verify/${scannedId}`, { replace: true })
    runVerification(scannedId)
  }, [navigate, runVerification])

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
          {/* ── Left Side: Search Form ─────────────────────────────────────── */}
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
                    placeholder="e.g., cert-001"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-accent-500 dark:text-accent-400 mt-2">
                    Try: <span
                      className="underline cursor-pointer text-primary-600 dark:text-primary-400"
                      onClick={() => {
                        setCertificateId('cert-001')
                        navigate('/verify/cert-001', { replace: true })
                        runVerification('cert-001')
                      }}
                    >cert-001</span>
                  </p>
                </div>

                {/* QR Scanner toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowScanner((prev) => !prev)}
                    className="w-full flex items-center justify-between bg-primary-50 dark:bg-primary-900 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-sm text-primary-700 dark:text-primary-200">
                      <QrCode className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      <div className="text-left">
                        <p className="font-medium">Scan QR Code</p>
                        <p className="text-xs text-primary-600 dark:text-primary-300">
                          Use your camera to scan a certificate's QR code
                        </p>
                      </div>
                    </div>
                    <Camera className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </button>

                  {/* QR Scanner — shown/hidden with animation */}
                  <AnimatePresence>
                    {showScanner && (
                      <QRScanner
                        onResult={handleQRResult}
                        onClose={() => setShowScanner(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading || !certificateId.trim()}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Verify Certificate
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* ── Right Side: Result (handled by Person 2) ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isLoading ? (
              <Card className="flex items-center justify-center min-h-96">
                <LoadingSpinner text="Verifying on blockchain..." />
              </Card>
            ) : verificationResult ? (
              <VerificationResultCard result={verificationResult} />
            ) : (
              <Card className="flex items-center justify-center min-h-96 border-2 border-dashed border-accent-300 dark:border-accent-600">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 dark:bg-accent-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-accent-600 dark:text-accent-400" />
                  </div>
                  <p className="text-accent-600 dark:text-accent-400 font-medium">
                    Enter a certificate ID or scan a QR code
                  </p>
                  <p className="text-accent-400 dark:text-accent-500 text-sm mt-1">
                    Results will appear here
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

// ─── Result Card (Person 2's section — unchanged from original) ───────────────

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

            <DetailRow label="Title" value={cert.certificateData.title} />
            <DetailRow label="Student" value={cert.studentName} />
            <DetailRow label="Institution" value={cert.certificateData.institution} />
            <DetailRow label="Program" value={cert.certificateData.program} />
            <DetailRow label="Issue Date" value={formatDate(cert.issueDate)} />
            {cert.expiryDate && (
              <DetailRow label="Expiry Date" value={formatDate(cert.expiryDate)} />
            )}
            {cert.certificateData.grade && (
              <DetailRow label="Grade" value={cert.certificateData.grade} />
            )}
            <DetailRow label="Issuer" value={truncateAddress(cert.issuerWallet)} mono />
            <DetailRow label="Student Wallet" value={truncateAddress(cert.studentWallet)} mono />
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
