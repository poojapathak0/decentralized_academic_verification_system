import { Request, Response, NextFunction } from "express";
import { BlockchainService } from "../services/blockchain.service";
import { certificateStore, StoredCertificate } from "../store/certificateStore";
import { wallet } from "../config/blockchain";

function toFrontendCert(c: StoredCertificate) {
  return {
    id: c.certificateId,
    studentId: c.certificateId,
    studentName: c.studentName,
    studentWallet: c.studentAddress,
    issueDate: c.graduationDate,
    issuer: c.institutionName,
    issuerWallet: wallet.address,
    certificateData: {
      title: c.programName,
      description: "",
      institution: c.institutionName,
      program: c.programName,
      completionDate: c.graduationDate,
    },
    ipfsHash: c.ipfsHash,
    status: c.isRevoked ? "revoked" : "valid",
    createdAt: c.issuedAt,
    updatedAt: c.issuedAt,
  }
}

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

      // Save to in-memory store so the dashboard can show it
      certificateStore.add({
        certificateId,
        studentAddress,
        studentName,
        programName,
        graduationDate,
        institutionName,
        ipfsHash,
        transactionHash: receipt.hash,
        issuedAt: new Date().toISOString(),
        isRevoked: false,
      });

      res.status(201).json({
        success: true,
        message: "Certificate issued successfully",
        transactionHash: receipt.hash,
        certificateId,
      });
    } catch (error) {
      next(error);
    }
  }

  static async revokeCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { certificateId } = req.body;

      const receipt = await BlockchainService.revokeCertificate(certificateId);
      certificateStore.revoke(certificateId);

      res.status(200).json({
        success: true,
        message: "Certificate revoked successfully",
        transactionHash: receipt.hash,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const certificateId = String(req.params.certificateId);
      const result = await BlockchainService.verifyCertificate(certificateId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { tokenId } = req.params;
      const certificate = await BlockchainService.getCertificate(Number(tokenId));
      res.status(200).json({ success: true, data: certificate });
    } catch (error) {
      next(error);
    }
  }

  static async getMyCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const studentAddress = req.query.address as string;
      if (!studentAddress) {
        return res.status(400).json({ success: false, message: "Student address is required" });
      }

      const certs = certificateStore.getByStudent(studentAddress).map(toFrontendCert);

      res.status(200).json({
        success: true,
        data: {
          data: certs,
          total: certs.length,
          page: 1,
          pageSize: certs.length || 10,
          hasMore: false,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdminCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const all = certificateStore.getAll().map(toFrontendCert);
      const start = (page - 1) * pageSize;
      const paged = all.slice(start, start + pageSize);

      res.status(200).json({
        success: true,
        data: {
          data: paged,
          total: all.length,
          page,
          pageSize,
          totalPages: Math.ceil(all.length / pageSize),
          hasMore: start + pageSize < all.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const recent = certificateStore.getAll()
        .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
        .slice(0, 5)
        .map(toFrontendCert);

      res.status(200).json({
        success: true,
        data: {
          totalCertificates: certificateStore.count(),
          validCertificates: certificateStore.countValid(),
          revokedCertificates: certificateStore.countRevoked(),
          pendingCertificates: 0,
          verificationCount: 0,
          issuedByMe: certificateStore.count(),
          totalStudents: certificateStore.uniqueStudents(),
          recentIssuances: recent,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
