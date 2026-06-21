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
      const studentAddress = req.query.address as string;

      if (!studentAddress) {
        console.error(`[CertificateController] ❌ Student address is required`);
        return res.status(400).json({ success: false, message: "Student address is required" });
      }

      console.log(`[CertificateController] 📚 Fetching certificates for student: ${studentAddress}`);

      const certificates = await BlockchainService.getCertificatesByStudent(studentAddress);

      console.log(`[CertificateController] ✅ Found ${certificates.length} certificates for student ${studentAddress}`);

      // FIXED: Properly convert all BigInt values to strings/numbers for JSON serialization
      const mappedCerts = certificates.map((cert: any) => ({
        id: cert.id || cert.certificateId || '',
        certificateId: cert.certificateId || '',
        studentAddress: cert.studentAddress || studentAddress,
        ipfsHash: cert.ipfsHash || cert.pdfUrl || '',
        isRevoked: cert.isRevoked || false,
        status: (cert.isRevoked || false) ? 'revoked' : 'valid',
        issueDate: cert.issueDate ? (typeof cert.issueDate === 'string' ? cert.issueDate : new Date(Number(cert.issueDate) * 1000).toISOString()) : new Date().toISOString(),
        expiryDate: cert.expiryDate ? (typeof cert.expiryDate === 'string' ? cert.expiryDate : new Date(Number(cert.expiryDate) * 1000).toISOString()) : new Date().toISOString(),
        certificateData: {
          studentName: cert.studentName || '',
          title: cert.certificateId || 'Certificate',
          description: cert.programName || '',
          program: cert.programName || '',
          institution: cert.institutionName || '',
          completionDate: cert.graduationDate || '',
          credits: Number(cert.certificateData?.credits || 0),
          grade: cert.certificateData?.grade || '',
        },
        qrCode: cert.qrCode || undefined,
        pdfUrl: cert.ipfsHash || '',
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
      console.error(`[CertificateController] ❌ Error in getMyCertificates:`, error);
      next(error);
    }
  }

  // Get certificates issued by a specific admin
  static async getAllAdminCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const adminAddress = req.query.address as string;

      if (!adminAddress) {
        console.error(`[CertificateController] ❌ Admin address is required`);
        return res.status(400).json({
          success: false,
          message: "Admin address is required"
        });
      }

      console.log(`[CertificateController] 📊 Fetching certificates for admin: ${adminAddress}`);

      // Get certificates issued by this admin
      const allCerts = BlockchainService.getCertificatesByAdmin(adminAddress);

      console.log(`[CertificateController] ✅ Found ${allCerts.length} certificates for admin ${adminAddress}`);

      // Map certificates to proper format
      const mappedCerts = allCerts.map((cert: any) => ({
        id: cert.id || cert.certificateId || '',
        certificateId: cert.certificateId || '',
        studentAddress: cert.studentAddress || '',
        studentName: cert.studentName || '',
        ipfsHash: cert.ipfsHash || cert.pdfUrl || '',
        isRevoked: cert.isRevoked || false,
        status: (cert.isRevoked || false) ? 'revoked' : 'valid',
        issueDate: cert.issueDate ? (typeof cert.issueDate === 'string' ? cert.issueDate : new Date(Number(cert.issueDate) * 1000).toISOString()) : new Date().toISOString(),
        expiryDate: cert.expiryDate ? (typeof cert.expiryDate === 'string' ? cert.expiryDate : new Date(Number(cert.expiryDate) * 1000).toISOString()) : new Date().toISOString(),
        certificateData: {
          studentName: cert.studentName || '',
          title: cert.certificateId || 'Certificate',
          description: cert.programName || '',
          program: cert.programName || '',
          institution: cert.institutionName || '',
          completionDate: cert.graduationDate || '',
          credits: Number(cert.certificateData?.credits || 0),
          grade: cert.certificateData?.grade || '',
        },
        qrCode: cert.qrCode || undefined,
        adminAddress: cert.adminAddress || adminAddress,
        isTestMode: cert.isTestMode || false,
      }))

      res.status(200).json({
        success: true,
        data: {
          data: mappedCerts,
          total: mappedCerts.length,
          page: 1,
          pageSize: 100,
          totalPages: 1,
        }
      });
    } catch (error) {
      console.error(`[CertificateController] ❌ Error in getAllAdminCertificates:`, error);
      next(error);
    }
  }

  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const adminAddress = req.query.address as string;

      if (!adminAddress) {
        console.error(`[CertificateController] ❌ Admin address is required for stats`);
        return res.status(400).json({
          success: false,
          message: "Admin address is required"
        });
      }

      console.log(`[CertificateController] 📈 Fetching dashboard stats for admin: ${adminAddress}`);

      // Get certificates issued by this admin
      const adminCerts = BlockchainService.getCertificatesByAdmin(adminAddress);

      console.log(`[CertificateController] Found ${adminCerts.length} total certificates for admin`);

      const totalCerts = adminCerts.length;
      const validCerts = adminCerts.filter((c) => !c.isRevoked).length;
      const revokedCerts = adminCerts.filter((c) => c.isRevoked).length;
      const uniqueStudents = new Set(adminCerts.map((c) => c.studentAddress)).size;

      // Get recent issuances (last 5)
      const recentIssuances = adminCerts
        .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
        .slice(0, 5)
        .map((cert: any) => ({
          id: cert.id || cert.certificateId || '',
          certificateId: cert.certificateId || '',
          studentName: cert.studentName || 'Unknown',
          programName: cert.programName || '',
          issueDate: cert.issueDate || new Date().toISOString(),
          certificateData: {
            title: cert.certificateId || 'Certificate',
            description: cert.programName || '',
          },
        }));

      console.log(`[CertificateController] ✅ Stats: Total=${totalCerts}, Valid=${validCerts}, Revoked=${revokedCerts}, Students=${uniqueStudents}`);

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
          recentIssuances: recentIssuances,
          adminAddress: adminAddress,
          testModeWarning: totalCerts > 0 && adminCerts.some((c: any) => c.isTestMode) ? "⚠️ TEST MODE: Some certificates are in test mode (not on blockchain). Fund wallet at https://faucet.polygon.technology/ for real blockchain." : undefined
        }
      });
    } catch (error) {
      console.error(`[CertificateController] ❌ Error in getDashboardStats:`, error);
      next(error);
    }
  }
}