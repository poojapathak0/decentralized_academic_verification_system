import { Request, Response, NextFunction } from "express";

/**
 * TEST/DEMO MODE for certificate issuance
 * This allows testing the complete application flow without blockchain transactions
 * Stores test certificates in memory (lost on server restart)
 * 
 * To enable: Set DEMO_MODE=true in backend/.env
 * To disable: Set DEMO_MODE=false or remove from .env
 */

const testCertificates: { [key: string]: any } = {};
let certificateCounter = 1000;

export class TestModeController {
  static async issueCertificateTest(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        studentAddress,
        ipfsHash,
        studentName,
        programName,
        graduationDate,
        institutionName,
        certificateId,
      } = req.body;

      // Validate required fields
      const missingFields = [];
      if (!studentAddress) missingFields.push("studentAddress");
      if (!studentName) missingFields.push("studentName");
      if (!programName) missingFields.push("programName");
      if (!graduationDate) missingFields.push("graduationDate");
      if (!institutionName) missingFields.push("institutionName");
      if (!certificateId) missingFields.push("certificateId");

      if (missingFields.length > 0) {
        const error: any = new Error(`Missing required fields: ${missingFields.join(", ")}`);
        error.statusCode = 400;
        error.code = "VALIDATION_ERROR";
        return next(error);
      }

      const testCertificateId = `cert-test-${certificateCounter++}`;
      const mockTransactionHash = `0x${Math.random().toString(16).substr(2)}${Math.random().toString(16).substr(2)}`;

      const certData = {
        id: testCertificateId,
        tokenId: certificateCounter,
        studentAddress,
        ipfsHash: ipfsHash || "QmTest123456789",
        studentName,
        programName,
        graduationDate,
        institutionName,
        certificateId,
        issueDate: new Date().toISOString(),
        isRevoked: false,
        transactionHash: mockTransactionHash,
        isTestMode: true,
      };

      testCertificates[testCertificateId] = certData;

      console.log(`[TestMode] Certificate issued (TEST MODE): ${testCertificateId}`);
      console.log(`[TestMode] Mock Transaction: ${mockTransactionHash}`);

      res.status(201).json({
        success: true,
        data: {
          message: "Certificate issued successfully (TEST MODE - Not on blockchain)",
          transactionHash: mockTransactionHash,
          certificateId: testCertificateId,
          testModeWarning:
            "⚠️  This is TEST MODE. Certificate is not stored on blockchain. To use real blockchain, fund the wallet.",
        },
      });
    } catch (error) {
      console.error(`[TestMode] Error:`, error);
      const err: any = error instanceof Error ? error : new Error("Unknown error");
      if (!err.statusCode) {
        err.statusCode = 500;
        err.code = "TEST_MODE_ERROR";
      }
      next(err);
    }
  }

  static async getCertificatesTest(req: Request, res: Response, next: NextFunction) {
    try {
      const studentAddress = req.query.address as string;

      if (!studentAddress) {
        return res.status(400).json({
          success: false,
          message: "Student address is required",
        });
      }

      const certificates = Object.values(testCertificates).filter(
        (cert) => cert.studentAddress === studentAddress
      );

      res.status(200).json({
        success: true,
        data: {
          data: certificates,
          total: certificates.length,
          page: 1,
          pageSize: 10,
          totalPages: 1,
          testModeWarning: "These are TEST MODE certificates, not stored on blockchain",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyCertificateTest(req: Request, res: Response, next: NextFunction) {
    try {
      const certificateId = String(req.params.certificateId);

      const cert = testCertificates[certificateId];

      if (!cert) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          certificate: cert,
          isValid: !cert.isRevoked,
          isTestMode: true,
          testModeWarning: "This is TEST MODE - not verified on blockchain",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static getStats(req: Request, res: Response) {
    const totalCerts = Object.keys(testCertificates).length;
    const stats = {
      totalCertificates: totalCerts,
      validCertificates: totalCerts,
      revokedCertificates: 0,
      totalStudents: new Set(Object.values(testCertificates).map((c) => c.studentAddress))
        .size,
      recentIssuances: Object.values(testCertificates).slice(-5),
      testModeWarning:
        "TEST MODE - All data is in-memory and will be lost on server restart",
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  }
}
