import { Request, Response, NextFunction } from "express";

export class AuthController {
  
  static async connectWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { address, signature } = req.body;
      // Here you would normally verify the signature to authenticate the user
      // For now, we will just return success

      res.status(200).json({
        success: true,
        message: "Wallet connected successfully",
        data: { address }
      });
    } catch (error) {
      next(error);
    }
  }
}