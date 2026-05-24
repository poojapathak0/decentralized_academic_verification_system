import { Router } from "express";
import { body } from "express-validator";
import { CertificateController } from "../controllers/certificate.controller";
import { validate } from "../middleware/validate.middleware";

const router = Router();

// Student Routes
router.get("/my", CertificateController.getMyCertificates);

// Admin Routes
router.post(
  "/issue",
  [
    body("studentAddress").isEthereumAddress().withMessage("Invalid Ethereum address"),
    body("ipfsHash").notEmpty().withMessage("IPFS hash is required"),
    body("studentName").notEmpty().withMessage("Student name is required"),
    body("programName").notEmpty().withMessage("Program name is required"),
    body("graduationDate").notEmpty().withMessage("Graduation date is required"),
    body("institutionName").notEmpty().withMessage("Institution name is required"),
    body("certificateId").notEmpty().withMessage("Certificate ID is required"),
  ],
  validate,
  CertificateController.issueCertificate
);

router.post(
  "/revoke",
  [
    body("certificateId").notEmpty().withMessage("Certificate ID is required")
  ],
  validate,
  CertificateController.revokeCertificate
);

router.get("/admin/all", CertificateController.getAllAdminCertificates);

// Public Verifier Routes
router.get("/verify/:certificateId", CertificateController.verifyCertificate);
router.get("/:tokenId", CertificateController.getCertificate);

export default router;