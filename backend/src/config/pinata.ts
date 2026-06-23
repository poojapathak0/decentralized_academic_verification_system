import { PinataSDK } from "pinata-web3";
import { env } from "./env";

export const pinata = new PinataSDK({
    pinataJwt: env.PINATA_JWT || "",
    pinataGateway: process.env.PINATA_GATEWAY || "gateway.pinata.cloud",
});