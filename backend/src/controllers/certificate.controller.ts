import { Request, Response, NextFunction } from "express";
import { BlockchainService } from "../services/blockchain.service";

export class CertificateController {
  
  static async issueCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { 
        studentAddress, 
        ipfsHash, 
        studentName, 
        programName, 
        graduationDate, 
        institutionName, 
        certificateId 
      } = req.body;

      // Validate required fields
      const missingFields = [];
      if (!studentAddress) missingFields.push('studentAddress');
      if (!ipfsHash) missingFields.push('ipfsHash');
      if (!studentName) missingFields.push('studentName');
      if (!programName) missingFields.push('programName');
      if (!graduationDate) missingFields.push('graduationDate');
      if (!institutionName) missingFields.push('institutionName');
      if (!certificateId) missingFields.push('certificateId');

      if (missingFields.length > 0) {
        console.error(`[CertificateController] Missing required fields: ${missingFields.join(', ')}`);
        const error: any = new Error(`Missing required fields: ${missingFields.join(', ')}`);
        error.statusCode = 400;
        error.code = 'VALIDATION_ERROR';
        return next(error);
      }

      // Validate Ethereum address format
      if (!studentAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        console.error(`[CertificateController] Invalid Ethereum address: ${studentAddress}`);
        const error: any = new Error(`Invalid Ethereum address format: ${studentAddress}`);
        error.statusCode = 400;
        error.code = 'INVALID_ADDRESS';
        return next(error);
      }

      console.log(`[CertificateController] Processing certificate issuance for ${studentName} (${studentAddress})`);

      const receipt = await BlockchainService.issueCertificate(
        studentAddress, 
        ipfsHash, 
        studentName, 
        programName, 
        graduationDate, 
        institutionName, 
        certificateId
      );

      console.log(`[CertificateController] Certificate issued successfully. Tx: ${receipt.hash}`);

      res.status(201).json({
        success: true,
        data: {
          message: "Certificate issued successfully",
          transactionHash: receipt.hash,
          certificateId
        }
      });
    } catch (error) {
      console.error(`[CertificateController] Error in issueCertificate:`, error);
      const err: any = error instanceof Error ? error : new Error('Unknown error');
      if (!err.statusCode) {
        err.statusCode = 500;
        err.code = 'BLOCKCHAIN_ERROR';
      }
      next(err);
    }
  }

  static async revokeCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { certificateId } = req.body;

      if (!certificateId) {
        console.error(`[CertificateController] Certificate ID is required for revocation`);
        const error: any = new Error('Certificate ID is required');
        error.statusCode = 400;
        error.code = 'VALIDATION_ERROR';
        return next(error);
      }

      console.log(`[CertificateController] Revoking certificate ${certificateId}`);

      const receipt = await BlockchainService.revokeCertificate(certificateId);

      console.log(`[CertificateController] Certificate revoked successfully. Tx: ${receipt.hash}`);

      res.status(200).json({
        success: true,
        data: {
          message: "Certificate revoked successfully",
          transactionHash: receipt.hash
        }
      });
    } catch (error) {
      console.error(`[CertificateController] Error in revokeCertificate:`, error);
      const err: any = error instanceof Error ? error : new Error('Unknown error');
      if (!err.statusCode) {
        err.statusCode = 500;
        err.code = 'BLOCKCHAIN_ERROR';
      }
      next(err);
    }
  }

  static async verifyCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const certificateId = String(req.params.certificateId);

      const result = await BlockchainService.verifyCertificate(certificateId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { tokenId } = req.params;
      
      const certificate = await BlockchainService.getCertificate(Number(tokenId));

      res.status(200).json({
        success: true,
        data: certificate
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      // Assuming wallet address is passed in query for now, or extracted from auth token
      const studentAddress = req.query.address as string;
      
      if (!studentAddress) {
        return res.status(400).json({ success: false, message: "Student address is required" });
      }

      const certificates = await BlockchainService.getCertificatesByStudent(studentAddress);

      // FIXED: Properly convert all BigInt values to strings/numbers for JSON serialization
      const mappedCerts = certificates.map((cert: any) => ({
        id: cert.id || cert.certificateId || '',
        certificateId: cert.certificateId || '',
        studentAddress: cert.studentAddress || studentAddress,
        ipfsHash: cert.ipfsHash || cert.pdfUrl || '',
        isRevoked: cert.isRevoked || false,
        status: (cert.isRevoked || false) ? 'revoked' : 'valid',
        issueDate: cert.issueDate ? new Date(Number(cert.issueDate) * 1000).toISOString() : new Date().toISOString(),
        expiryDate: cert.expiryDate ? new Date(Number(cert.expiryDate) * 1000).toISOString() : new Date().toISOString(),
        certificateData: {
          studentName: cert.certificateData?.studentName || cert.studentName || '',
          programName: cert.certificateData?.programName || cert.program || '',
          institutionName: cert.certificateData?.institutionName || cert.institution || '',
          graduationDate: cert.certificateData?.graduationDate || cert.completionDate || '',
          credits: Number(cert.certificateData?.credits || 0),
          grade: cert.certificateData?.grade || '',
        },
        qrCode: cert.qrCode || undefined,
      }))

      res.status(200).json({
        success: true,
        data: {
          data: mappedCerts,
          total: mappedCerts.length,
          page: 1,
          pageSize: 10,
          totalPages: Math.ceil(mappedCerts.length / 10),
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Example placeholder for getting institution's issued certs
  static async getAllAdminCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const adminAddress = req.query.address as string;
      
      if (!adminAddress) {
        return res.status(400).json({ 
          success: false, 
          message: "Admin address is required" 
        });
      }

      // FIXED: Return all certificates from both test mode and blockchain
      // In a real app, filter by admin address stored on blockchain
      const allTestCerts = (BlockchainService as any).getAllTestCertificates?.() || [];
      
      // Try to fetch blockchain certificates too (will use test mode as fallback)
      let blockchainCerts: any[] = [];
      try {
        blockchainCerts = await BlockchainService.getCertificatesByStudent('0x0000000000000000000000000000000000000000');
      } catch (e) {
        // Expected to fail - just use test mode
      }
      
      // Combine and deduplicate
      const allCerts = [
        ...allTestCerts,
        ...blockchainCerts.filter((bc: any) => !allTestCerts.find((tc: any) => tc.certificateId === bc.certificateId))
      ];
      
      res.status(200).json({
        success: true,
        data: {
          data: allCerts,
          total: allCerts.length,
          page: 1,
          pageSize: 10,
          totalPages: Math.ceil(allCerts.length / 10),
          testModeWarning: allCerts.length > 0 ? "Note: If wallet lacks MATIC, certificates are in TEST MODE (not on blockchain). Fund wallet for real blockchain: https://faucet.polygon.technology/" : undefined
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const adminAddress = req.query.address as string;
      
      if (!adminAddress) {
        return res.status(400).json({
          success: false,
          message: "Admin address is required"
        });
      }

      // Get all test mode certificates (admin issued)
      const testCerts = (BlockchainService as any).getAllTestCertificates?.() || [];
      const totalCerts = testCerts.length;
      const validCerts = testCerts.filter((c) => !c.isRevoked).length;
      const revokedCerts = testCerts.filter((c) => c.isRevoked).length;
      const uniqueStudents = new Set(testCerts.map((c) => c.studentAddress)).size;

      // Return stats including test mode certificates
      res.status(200).json({
        success: true,
        data: {
          totalCertificates: totalCerts,
          validCertificates: validCerts,
          revokedCertificates: revokedCerts,
          pendingCertificates: 0,
          verificationCount: totalCerts,
          issuedByMe: totalCerts,
          totalStudents: uniqueStudents,
          recentIssuances: testCerts.slice(-5),
          testModeWarning: totalCerts > 0 ? "TEST MODE: Data not on blockchain. Fund wallet for real blockchain." : undefined
        }
      });
    } catch (error) {
      next(error);
    }
  }
}