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

      const receipt = await BlockchainService.issueCertificate(
        studentAddress, 
        ipfsHash, 
        studentName, 
        programName, 
        graduationDate, 
        institutionName, 
        certificateId
      );

      res.status(201).json({
        success: true,
        message: "Certificate issued successfully",
        transactionHash: receipt.hash,
        certificateId
      });
    } catch (error) {
      next(error);
    }
  }

  static async revokeCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { certificateId } = req.body;

      const receipt = await BlockchainService.revokeCertificate(certificateId);

      res.status(200).json({
        success: true,
        message: "Certificate revoked successfully",
        transactionHash: receipt.hash
      });
    } catch (error) {
      next(error);
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

      res.status(200).json({
        success: true,
        data: certificates
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

      // In a real application, you might query a database / subgraph since the contract 
      // does not keep an array of all certificates issued by an admin directly in simple form.
      // For now, return empty list with pagination structure
      res.status(200).json({
        success: true,
        data: {
          data: [],
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0
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

      // Return sample stats - in production this would query blockchain events
      res.status(200).json({
        success: true,
        data: {
          totalCertificates: 0,
          validCertificates: 0,
          revokedCertificates: 0,
          pendingCertificates: 0,
          verificationCount: 0,
          issuedByMe: 0,
          totalStudents: 0,
          recentIssuances: []
        }
      });
    } catch (error) {
      next(error);
    }
  }
}