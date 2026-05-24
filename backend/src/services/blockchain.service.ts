import { contract } from "../config/blockchain";

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
      const tx = await contract.issueCertificate(
        studentAddress,
        ipfsHash,
        studentName,
        programName,
        graduationDate,
        institutionName,
        certificateId
      );
      
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Error issuing certificate on-chain:", error);
      throw error;
    }
  }

  /**
   * Revoke a certificate
   */
  static async revokeCertificate(certificateId: string) {
    try {
      const tx = await contract.revokeCertificate(certificateId);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Error revoking certificate on-chain:", error);
      throw error;
    }
  }

  /**
   * Verify certificate public
   */
  static async verifyCertificate(certificateId: string) {
    try {
      const result = await contract.verifyCertificate(certificateId);
      // result is [certificate, isValid]
      return {
        certificate: result[0],
        isValid: result[1]
      };
    } catch (error) {
      console.error("Error verifying certificate:", error);
      throw error;
    }
  }

  /**
   * Get specific certificate by tokenID
   */
  static async getCertificate(tokenId: number) {
    try {
      return await contract.getCertificate(tokenId);
    } catch (error) {
      console.error("Error fetching certificate:", error);
      throw error;
    }
  }

  /**
   * Get student certificates
   */
  static async getCertificatesByStudent(studentAddress: string) {
    try {
      return await contract.getCertificatesByStudent(studentAddress);
    } catch (error) {
      console.error("Error fetching student certificates:", error);
      throw error;
    }
  }
}