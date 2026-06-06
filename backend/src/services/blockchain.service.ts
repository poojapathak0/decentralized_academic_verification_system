import { contract } from "../config/blockchain";

// Test mode storage
const testCertificates: { [key: string]: any } = {};
// Track all issued certificates (both test mode and blockchain)
const issuedCertificates: { [key: string]: any } = {};
let certificateCounter = 1000;

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
      issuedCertificates[certificateId] = {
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
      };
      
      console.log(`[BlockchainService] Certificate issued successfully. Tx: ${receipt.hash}`);
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
    };

    testCertificates[testCertId] = certData;

    console.log(`[BlockchainService] TEST MODE Certificate created: ${testCertId}`);
    console.log(`[BlockchainService] ⚠️  WARNING: This certificate is NOT stored on blockchain`);
    console.log(`[BlockchainService] To use real blockchain, fund wallet: https://faucet.polygon.technology/`);

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
   * Get all test mode certificates (for admin dashboard)
   */
  static getAllTestCertificates() {
    // Return both test mode and blockchain-issued certificates
    return [
      ...Object.values(testCertificates),
      ...Object.values(issuedCertificates)
    ];
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
   * Get student certificates
   */
  static async getCertificatesByStudent(studentAddress: string) {
    try {
      console.log(`[BlockchainService] Fetching certificates for ${studentAddress}...`);
      
      if (!studentAddress || !studentAddress.startsWith('0x')) {
        throw new Error(`Invalid student address: ${studentAddress}`);
      }
      
      return await contract.getCertificatesByStudent(studentAddress);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[BlockchainService] Error fetching student certificates: ${errorMessage}`, error);
      throw error;
    }
  }
}