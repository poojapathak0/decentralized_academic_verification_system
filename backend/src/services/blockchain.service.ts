import { contract, wallet } from "../config/blockchain";

// Test mode storage
const testCertificates: { [key: string]: any } = {};
// Track all issued certificates (both test mode and blockchain)
const issuedCertificates: { [key: string]: any } = {};
// Track certificates by admin address
const adminCertificates: { [adminAddress: string]: any[] } = {};
// Track certificates by student address
const studentCertificates: { [studentAddress: string]: any[] } = {};
let certificateCounter = 1000;

const ADMIN_ADDRESS = wallet.address.toLowerCase();

export class BlockchainService {
  /**
   * Issue a new certificate
   */
  static async issueCertificate(
    studentAddress: string,
    ipfsHash: string,
    studentName: string,
    programName: string,
    graduationDate: string,
    institutionName: string,
    certificateId: string
  ) {
    try {
      console.log(`[BlockchainService] Issuing certificate for ${studentAddress}...`);
      
      if (!studentAddress || !studentAddress.startsWith('0x')) {
        throw new Error(`Invalid student address: ${studentAddress}`);
      }
      
      if (!ipfsHash) {
        throw new Error('IPFS hash is required');
      }

      const tx = await contract.issueCertificate(
        studentAddress,
        ipfsHash,
        studentName,
        programName,
        graduationDate,
        institutionName,
        certificateId
      );
      
      console.log(`[BlockchainService] Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed - no receipt returned');
      }
      
      // Store blockchain certificate for later retrieval
      const certData = {
        id: certificateId,
        studentAddress,
        ipfsHash,
        studentName,
        programName,
        graduationDate,
        institutionName,
        certificateId,
        issueDate: new Date().toISOString(),
        isRevoked: false,
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        transactionHash: receipt.hash,
        isTestMode: false,
        adminAddress: ADMIN_ADDRESS,
      };

      issuedCertificates[certificateId] = certData;

      // Track by admin address
      if (!adminCertificates[ADMIN_ADDRESS]) {
        adminCertificates[ADMIN_ADDRESS] = [];
      }
      adminCertificates[ADMIN_ADDRESS].push(certData);

      // Track by student address
      const normalizedStudentAddress = studentAddress.toLowerCase();
      if (!studentCertificates[normalizedStudentAddress]) {
        studentCertificates[normalizedStudentAddress] = [];
      }
      studentCertificates[normalizedStudentAddress].push(certData);

      console.log(`[BlockchainService] ✅ Certificate issued successfully`);
      console.log(`  - Certificate ID: ${certificateId}`);
      console.log(`  - Student: ${studentName} (${studentAddress})`);
      console.log(`  - Admin: ${ADMIN_ADDRESS}`);
      console.log(`  - Transaction: ${receipt.hash}`);
      console.log(`  - Total certs by admin: ${adminCertificates[ADMIN_ADDRESS].length}`);
      console.log(`  - Total certs for student: ${studentCertificates[normalizedStudentAddress].length}`);
      return receipt;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = (error as any)?.code;
      console.error(`[BlockchainService] Error issuing certificate: ${errorMessage}`, error);
      
      // FALLBACK: Use test mode if gas is insufficient
      if (
        errorMessage.includes('insufficient funds') || 
        errorCode === 'INSUFFICIENT_FUNDS'
      ) {
        console.log(`[BlockchainService] Gas insufficient. Using TEST MODE fallback...`);
        return this.issueCertificateTestMode(
          studentAddress,
          ipfsHash,
          studentName,
          programName,
          graduationDate,
          institutionName,
          certificateId
        );
      }
      
      // Re-throw with more context
      const err = new Error(`Failed to issue certificate on-chain: ${errorMessage}`);
      throw err;
    }
  }

  /**
   * Test mode certificate issuance (in-memory, no gas cost)
   */
  static issueCertificateTestMode(
    studentAddress: string,
    ipfsHash: string,
    studentName: string,
    programName: string,
    graduationDate: string,
    institutionName: string,
    certificateId: string
  ) {
    const testCertId = `cert-test-${certificateCounter++}`;
    const mockHash = `0x${Math.random().toString(16).substr(2)}${Math.random().toString(16).substr(2)}`;

    const certData = {
      id: testCertId,
      tokenId: certificateCounter,
      studentAddress,
      ipfsHash: ipfsHash || 'QmTest123456789',
      studentName,
      programName,
      graduationDate,
      institutionName,
      certificateId,
      issueDate: new Date().toISOString(),
      isRevoked: false,
      hash: mockHash,
      isTestMode: true,
      adminAddress: ADMIN_ADDRESS,
    };

    testCertificates[testCertId] = certData;

    // Track by admin address
    if (!adminCertificates[ADMIN_ADDRESS]) {
      adminCertificates[ADMIN_ADDRESS] = [];
    }
    adminCertificates[ADMIN_ADDRESS].push(certData);

    // Track by student address
    const normalizedStudentAddress = studentAddress.toLowerCase();
    if (!studentCertificates[normalizedStudentAddress]) {
      studentCertificates[normalizedStudentAddress] = [];
    }
    studentCertificates[normalizedStudentAddress].push(certData);

    console.log(`[BlockchainService] 🧪 TEST MODE Certificate created`);
    console.log(`  - Certificate ID: ${certificateId}`);
    console.log(`  - Student: ${studentName} (${studentAddress})`);
    console.log(`  - Admin: ${ADMIN_ADDRESS}`);
    console.log(`  - Total certs by admin: ${adminCertificates[ADMIN_ADDRESS].length}`);
    console.log(`  - Total certs for student: ${studentCertificates[normalizedStudentAddress].length}`);
    console.log(`  - ⚠️  WARNING: This certificate is NOT stored on blockchain`);
    console.log(`  - To use real blockchain, fund wallet: https://faucet.polygon.technology/`);

    return {
      hash: mockHash,
      blockNumber: 0,
      transactionHash: mockHash,
      isTestMode: true,
      testModeWarning: 'Certificate issued in TEST MODE (not on blockchain). Fund wallet to use real blockchain.',
    };
  }

  /**
   * Get all test mode certificates for a student
   */
  static getTestCertificates(studentAddress: string) {
    return Object.values(testCertificates).filter(
      (cert) => cert.studentAddress === studentAddress
    );
  }

  /**
   * Revoke a certificate
   */
  static async revokeCertificate(certificateId: string) {
    try {
      console.log(`[BlockchainService] Revoking certificate ${certificateId}...`);
      
      if (!certificateId) {
        throw new Error('Certificate ID is required');
      }

      const tx = await contract.revokeCertificate(certificateId);
      console.log(`[BlockchainService] Revoke transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed - no receipt returned');
      }
      
      console.log(`[BlockchainService] Certificate revoked successfully. Tx: ${receipt.hash}`);
      return receipt;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[BlockchainService] Error revoking certificate: ${errorMessage}`, error);
      
      // Fallback for test mode
      if (errorMessage.includes('insufficient funds') || errorMessage.includes('INSUFFICIENT_FUNDS')) {
        console.log(`[BlockchainService] Using TEST MODE fallback for revoke...`);
        return {
          hash: `0x${Math.random().toString(16).substr(2)}`,
          isTestMode: true,
        };
      }
      
      const err = new Error(`Failed to revoke certificate: ${errorMessage}`);
      throw err;
    }
  }

  /**
   * Verify certificate public
   */
  static async verifyCertificate(certificateId: string) {
    try {
      console.log(`[BlockchainService] Verifying certificate ${certificateId}...`);
      
      const result = await contract.verifyCertificate(certificateId);
      // result is [certificate, isValid]
      return {
        certificate: result[0],
        isValid: result[1]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[BlockchainService] Error verifying certificate: ${errorMessage}`, error);
      throw error;
    }
  }

  /**
   * Get specific certificate by tokenID
   */
  static async getCertificate(tokenId: number) {
    try {
      console.log(`[BlockchainService] Fetching certificate ${tokenId}...`);
      return await contract.getCertificate(tokenId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[BlockchainService] Error fetching certificate: ${errorMessage}`, error);
      throw error;
    }
  }

  /**
   * Get student certificates (from memory + blockchain)
   */
  static async getCertificatesByStudent(studentAddress: string) {
    try {
      console.log(`[BlockchainService] 📚 Fetching certificates for student: ${studentAddress}`);

      if (!studentAddress || !studentAddress.startsWith('0x')) {
        throw new Error(`Invalid student address: ${studentAddress}`);
      }

      // First check in-memory test mode certificates
      const normalizedAddress = studentAddress.toLowerCase();
      const memoryBasedCerts = studentCertificates[normalizedAddress] || [];
      console.log(`[BlockchainService] Found ${memoryBasedCerts.length} certificates in memory for student ${normalizedAddress}`);

      // If we have certificates in memory, return them (test mode)
      if (memoryBasedCerts.length > 0) {
        console.log(`[BlockchainService] ✅ Returning ${memoryBasedCerts.length} certificates from memory (test mode)`);
        return memoryBasedCerts;
      }

      // Otherwise try blockchain (for real blockchain mode)
      try {
        console.log(`[BlockchainService] No certificates in memory, trying blockchain...`);
        const blockchainCerts = await contract.getCertificatesByStudent(studentAddress);
        console.log(`[BlockchainService] ✅ Found ${blockchainCerts.length} certificates on blockchain`);
        return blockchainCerts;
      } catch (blockchainError) {
        const errorMsg = blockchainError instanceof Error ? blockchainError.message : 'Unknown error';
        console.log(`[BlockchainService] Blockchain query failed: ${errorMsg}`);
        // Return empty array instead of crashing
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[BlockchainService] Error fetching student certificates: ${errorMessage}`, error);
      return [];
    }
  }

  /**
   * Get certificates by admin address
   */
  static getCertificatesByAdmin(adminAddress: string) {
    try {
      const normalizedAddress = adminAddress.toLowerCase();
      console.log(`[BlockchainService] 📊 Fetching certificates for admin: ${normalizedAddress}`);

      if (!adminAddress || !adminAddress.startsWith('0x')) {
        throw new Error(`Invalid admin address: ${adminAddress}`);
      }

      const certs = adminCertificates[normalizedAddress] || [];
      console.log(`[BlockchainService] Found ${certs.length} certificates for admin ${normalizedAddress}`);

      return certs;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[BlockchainService] Error fetching admin certificates: ${errorMessage}`, error);
      throw error;
    }
  }

  /**
   * Get all test certificates (for backward compatibility)
   */
  static getAllTestCertificates() {
    console.log(`[BlockchainService] 📋 Getting all certificates (test mode + blockchain)`);
    console.log(`  - Test mode certs: ${Object.keys(testCertificates).length}`);
    console.log(`  - Blockchain certs: ${Object.keys(issuedCertificates).length}`);

    // Return both test mode and blockchain-issued certificates
    return [
      ...Object.values(testCertificates),
      ...Object.values(issuedCertificates)
    ];
  }
}