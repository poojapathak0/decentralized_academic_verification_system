import { Request, Response, NextFunction } from "express";
import { IpfsService } from "../services/ipfs.service";

export class UploadController {
  
  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const ipfsHash = await IpfsService.uploadFile(req.file.path, req.file.originalname);

      res.status(200).json({
        success: true,
        message: "File uploaded successfully to IPFS",
        ipfsHash
      });
    } catch (error) {
      next(error);
    }
  }
}