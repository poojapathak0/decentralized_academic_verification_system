import { pinata } from "../config/pinata";
import fs from "fs";

export class IpfsService {
  /**
   * Upload a file to Pinata IPFS
   * @param filePath Path to the local file
   * @param originalName Original file name
   */
  static async uploadFile(filePath: string, originalName: string) {
    try {
      const readableStreamForFile = fs.createReadStream(filePath);
      
      const upload = await pinata.upload.file(
        new File([fs.readFileSync(filePath)], originalName, { type: "application/octet-stream" })
      );

      return upload.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw new Error("Failed to upload to IPFS");
    } finally {
      // Clean up the temp file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
}