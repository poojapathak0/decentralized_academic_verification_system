export interface StoredCertificate {
  certificateId: string
  studentAddress: string
  studentName: string
  programName: string
  graduationDate: string
  institutionName: string
  ipfsHash: string
  transactionHash: string
  issuedAt: string
  isRevoked: boolean
}

const store = new Map<string, StoredCertificate>()

export const certificateStore = {
  add(cert: StoredCertificate) {
    store.set(cert.certificateId, cert)
  },
  getAll(): StoredCertificate[] {
    return Array.from(store.values())
  },
  getByStudent(address: string): StoredCertificate[] {
    return Array.from(store.values()).filter(
      c => c.studentAddress.toLowerCase() === address.toLowerCase()
    )
  },
  revoke(certId: string) {
    const cert = store.get(certId)
    if (cert) cert.isRevoked = true
  },
  count(): number {
    return store.size
  },
  countValid(): number {
    return Array.from(store.values()).filter(c => !c.isRevoked).length
  },
  countRevoked(): number {
    return Array.from(store.values()).filter(c => c.isRevoked).length
  },
  uniqueStudents(): number {
    return new Set(Array.from(store.values()).map(c => c.studentAddress.toLowerCase())).size
  }
}
