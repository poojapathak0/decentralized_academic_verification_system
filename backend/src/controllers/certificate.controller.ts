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
      // In a real application, you might query a database / subgraph since the contract 
      // does not keep an array of all certificates issued by an admin directly in simple form.
      res.status(200).json({
        success: true,
        message: "Not fully implemented without a database or events indexing.",
        data: []
      });
    } catch (error) {
      next(error);
    }
  }
}