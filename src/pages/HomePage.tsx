import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Shield, Users, Zap, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { UserRole } from '@/types'

export function HomePage() {
  const navigate = useNavigate()
  const { setRole } = useAuthStore()
  const { setShowWalletModal } = useUIStore()

  const handleRoleSelect = (role: UserRole) => {
    setRole(role)
    setShowWalletModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent-50 dark:from-accent-900 dark:to-accent-800">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                ✓
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent-900 dark:text-white mb-6 leading-tight">
              Academic Credentials{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Verification System
              </span>
            </h1>

            <p className="text-lg md:text-xl text-accent-600 dark:text-accent-400 mb-8 max-w-2xl mx-auto">
              Secure, verifiable, and instantly shareable academic credentials on the blockchain.
              Powered by decentralized technology for complete transparency and trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => navigate('/verify')}
                className="flex items-center justify-center gap-2 group"
              >
                Verify Credential
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleRoleSelect(UserRole.STUDENT)}
                className="flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
                  100%
                </p>
                <p className="text-sm text-accent-600 dark:text-accent-400">Secure & Verified</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
                  Instant
                </p>
                <p className="text-sm text-accent-600 dark:text-accent-400">Verification</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
                  On-Chain
                </p>
                <p className="text-sm text-accent-600 dark:text-accent-400">Immutable</p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-accent-800">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400">
              The modern way to issue and verify academic credentials
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Secure',
                description: 'Military-grade encryption and blockchain security',
              },
              {
                icon: CheckCircle,
                title: 'Verified',
                description: 'Instant verification with proof of authenticity',
              },
              {
                icon: Users,
                title: 'Shareable',
                description: 'Easy sharing with QR codes and digital links',
              },
              {
                icon: Zap,
                title: 'Instant',
                description: 'Real-time issuance and verification',
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="text-center p-6">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-accent-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-accent-600 dark:text-accent-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Role Selection Section */}
      <section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white mb-4">
              Choose Your Role
            </h2>
            <p className="text-lg text-accent-600 dark:text-accent-400">
              Get started as a student, institution, or verifier
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                role: UserRole.PUBLIC,
                title: 'Verifier',
                description: 'Verify and validate academic credentials',
                features: ['Search certificates', 'Scan QR codes', 'View details'],
                color: 'blue',
              },
              {
                role: UserRole.STUDENT,
                title: 'Student',
                description: 'Manage your academic credentials',
                features: ['Store credentials', 'Share credentials', 'Track history'],
                color: 'green',
                highlighted: true,
              },
              {
                role: UserRole.ADMIN,
                title: 'Institution',
                description: 'Issue and manage credentials',
                features: ['Issue certificates', 'Manage records', 'View analytics'],
                color: 'purple',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, x: item.highlighted ? 0 : idx === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <Card
                  className={`h-full transition-all ${
                    item.highlighted
                      ? 'ring-2 ring-primary-600 dark:ring-primary-400 scale-105'
                      : ''
                  }`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    {item.highlighted && (
                      <div className="mb-3 text-center">
                        <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-bold">
                          POPULAR
                        </span>
                      </div>
                    )}

                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                      {
                        blue: 'bg-blue-100 dark:bg-blue-900',
                        green: 'bg-green-100 dark:bg-green-900',
                        purple: 'bg-purple-100 dark:bg-purple-900',
                      }[item.color]
                    }`}>
                      <span className="text-2xl">
                        {item.role === UserRole.PUBLIC ? '👁️' : item.role === UserRole.STUDENT ? '👨‍🎓' : '🏫'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-accent-900 dark:text-white mb-2 text-center">
                      {item.title}
                    </h3>
                    <p className="text-sm text-accent-600 dark:text-accent-400 text-center mb-4">
                      {item.description}
                    </p>

                    <ul className="flex-1 space-y-2 mb-6">
                      {item.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-accent-700 dark:text-accent-300">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={item.highlighted ? 'primary' : 'outline'}
                      onClick={() => handleRoleSelect(item.role)}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students and institutions already using our secure credential system
            </p>
            <Button
              onClick={() => handleRoleSelect(UserRole.STUDENT)}
              className="bg-white text-primary-600 hover:bg-primary-50 flex items-center justify-center gap-2 mx-auto group"
              size="lg"
            >
              Connect Wallet
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
