import { ethers } from "ethers";
import { env } from "./env";
import AcademicCredentialArtifact from "../utils/AcademicCredential.json"; 

export const provider = new ethers.JsonRpcProvider(env.RPC_URL);
export const wallet = new ethers.Wallet(env.PRIVATE_KEY, provider);

// We need an ABI. You should place the compiled AcademicCredential ABI block here, 
// or import it from an ABI JSON file.
// For simplicity, we are passing the artifact assuming it's available.
export const contract = new ethers.Contract(
  env.CONTRACT_ADDRESS,
  AcademicCredentialArtifact.abi,
  wallet
);