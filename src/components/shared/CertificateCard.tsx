import { Certificate, CertificateStatus } from '@/types'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Download, Share2, Eye, Trash2 } from 'lucide-react'
import { formatDate, formatStatus } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CertificateCardProps {
  certificate: Certificate
  onView?: (cert: Certificate) => void
  onDownload?: (cert: Certificate) => void
  onShare?: (cert: Certificate) => void
  onRevoke?: (cert: Certificate) => void
  showActions?: boolean
}

export function CertificateCard({
  certificate,
  onView,
  onDownload,
  onShare,
  onRevoke,
  showActions = true,
}: CertificateCardProps) {
  const statusInfo = formatStatus(certificate.status || CertificateStatus.VALID)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <CardContent className="p-0">
          {/* Gradient Header */}
          <div className="h-2 bg-gradient-to-r from-primary-600 to-primary-400" />

          <div className="p-4 sm:p-6">
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-4">
              <Badge variant={statusInfo.color as any}>{statusInfo.label}</Badge>
              <span className="text-xs text-accent-500 dark:text-accent-400">
                #{certificate.id.slice(-8)}
              </span>
            </div>

            {/* Certificate Title */}
            <h3 className="text-lg font-bold text-accent-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {certificate.certificateData.title}
            </h3>

            {/* Student & Institution */}
            <p className="text-sm text-accent-600 dark:text-accent-400 mb-3">
              {certificate.studentName} • {certificate.certificateData.institution}
            </p>

            {/* Details */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-accent-600 dark:text-accent-400">Program:</span>
                <span className="font-medium text-accent-900 dark:text-white">
                  {certificate.certificateData.program}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent-600 dark:text-accent-400">Issued:</span>
                <span className="font-medium text-accent-900 dark:text-white">
                  {formatDate(certificate.issueDate)}
                </span>
              </div>
              {certificate.certificateData.grade && (
                <div className="flex justify-between">
                  <span className="text-accent-600 dark:text-accent-400">Grade:</span>
                  <span className="font-medium text-accent-900 dark:text-white">
                    {certificate.certificateData.grade}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex gap-2 pt-4 border-t border-accent-200 dark:border-accent-700 flex-wrap">
                {onView && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(certificate)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                )}
                {onDownload && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownload(certificate)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                )}
                {onShare && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onShare(certificate)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                )}
                {onRevoke && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onRevoke(certificate)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Revoke</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
