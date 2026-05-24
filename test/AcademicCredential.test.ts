import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('AcademicCredential', function () {
  async function deployFixture() {
    const [deployer, institutionAdmin, student, otherStudent, randomWallet] = await ethers.getSigners()

    const AcademicCredential = await ethers.getContractFactory('AcademicCredential')
    const academicCredential = await AcademicCredential.deploy()
    await academicCredential.waitForDeployment()

    await academicCredential.grantInstitutionAdmin(institutionAdmin.address)

    return { academicCredential, deployer, institutionAdmin, student, otherStudent, randomWallet }
  }

  it('allows the default admin to manage institution admins', async function () {
    const { academicCredential, institutionAdmin, randomWallet } = await loadFixture(deployFixture)

    expect(await academicCredential.hasRole(await academicCredential.DEFAULT_ADMIN_ROLE(), institutionAdmin.address)).to.equal(false)

    await expect(academicCredential.connect(randomWallet).grantInstitutionAdmin(randomWallet.address)).to.be.reverted

    await academicCredential.revokeInstitutionAdmin(institutionAdmin.address)
    expect(await academicCredential.hasRole(await academicCredential.INSTITUTION_ADMIN_ROLE(), institutionAdmin.address)).to.equal(false)
  })

  it('issues and verifies certificates', async function () {
    const { academicCredential, institutionAdmin, student } = await loadFixture(deployFixture)

    await expect(
      academicCredential
        .connect(institutionAdmin)
        .issueCertificate(
          student.address,
          'QmTestIpfsHash',
          'Ada Lovelace',
          'Bachelor of Computer Science',
          '2026-05-24',
          'Institute of Blockchain Studies',
          'CERT-2026-0001',
        ),
    )
      .to.emit(academicCredential, 'CertificateIssued')
      .withArgs(1, student.address, 'CERT-2026-0001', 'QmTestIpfsHash')

    const [certificate, isValid] = await academicCredential.verifyCertificate('CERT-2026-0001')

    expect(isValid).to.equal(true)
    expect(certificate.tokenId).to.equal(1)
    expect(certificate.studentAddress).to.equal(student.address)
    expect(certificate.studentName).to.equal('Ada Lovelace')
    expect(certificate.programName).to.equal('Bachelor of Computer Science')
    expect(certificate.institutionName).to.equal('Institute of Blockchain Studies')
    expect(certificate.certificateId).to.equal('CERT-2026-0001')
  })

  it('prevents duplicate certificate ids', async function () {
    const { academicCredential, institutionAdmin, student, otherStudent } = await loadFixture(deployFixture)

    await academicCredential
      .connect(institutionAdmin)
      .issueCertificate(
        student.address,
        'QmFirstHash',
        'Ada Lovelace',
        'Bachelor of Computer Science',
        '2026-05-24',
        'Institute of Blockchain Studies',
        'CERT-2026-0001',
      )

    await expect(
      academicCredential
        .connect(institutionAdmin)
        .issueCertificate(
          otherStudent.address,
          'QmSecondHash',
          'Grace Hopper',
          'Master of Software Engineering',
          '2026-05-24',
          'Institute of Blockchain Studies',
          'CERT-2026-0001',
        ),
    ).to.be.revertedWithCustomError(academicCredential, 'CertificateAlreadyExists')
  })

  it('returns student certificates and supports revocation', async function () {
    const { academicCredential, institutionAdmin, student } = await loadFixture(deployFixture)

    await academicCredential
      .connect(institutionAdmin)
      .issueCertificate(
        student.address,
        'QmValidHash',
        'Ada Lovelace',
        'Bachelor of Computer Science',
        '2026-05-24',
        'Institute of Blockchain Studies',
        'CERT-2026-0001',
      )

    const certificates = await academicCredential.getCertificatesByStudent(student.address)
    expect(certificates).to.have.lengthOf(1)
    expect(certificates[0].certificateId).to.equal('CERT-2026-0001')

    await expect(academicCredential.connect(institutionAdmin).revokeCertificate('CERT-2026-0001'))
      .to.emit(academicCredential, 'CertificateRevoked')
      .withArgs('CERT-2026-0001', anyValue)

    const [revokedCertificate, isValid] = await academicCredential.verifyCertificate('CERT-2026-0001')
    expect(isValid).to.equal(false)
    expect(revokedCertificate.isRevoked).to.equal(true)
    expect(await academicCredential.isValidCertificate('CERT-2026-0001')).to.equal(false)
  })

  it('reverts when a non-admin tries to issue or revoke', async function () {
    const { academicCredential, student } = await loadFixture(deployFixture)

    await expect(
      academicCredential
        .connect(student)
        .issueCertificate(
          student.address,
          'QmBlockedHash',
          'Ada Lovelace',
          'Bachelor of Computer Science',
          '2026-05-24',
          'Institute of Blockchain Studies',
          'CERT-2026-0002',
        ),
    ).to.be.reverted

    await expect(academicCredential.connect(student).revokeCertificate('CERT-2026-0001')).to.be.reverted
  })
})