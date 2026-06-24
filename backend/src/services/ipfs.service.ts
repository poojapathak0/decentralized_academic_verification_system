import { pinata } from "../config/pinata";
import fs from "fs";

export class IpfsService {
  static async uploadFile(filePath: string, originalName: string) {
    const jwt = process.env.PINATA_JWT;

    // No real Pinata JWT — skip upload and return a placeholder hash
    if (!jwt || jwt === "FILL_IN_YOUR_PINATA_JWT") {
      console.warn("Pinata JWT not configured — skipping IPFS upload, using placeholder hash");
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return `placeholder-${Date.now()}`;
    }

    try {
      const upload = await pinata.upload.file(
        new File([fs.readFileSync(filePath)], originalName, { type: "application/octet-stream" })
      );
      return upload.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw new Error("Failed to upload to IPFS");
    } finally {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }
}