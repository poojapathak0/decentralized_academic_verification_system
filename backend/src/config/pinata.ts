import { PinataSDK } from "pinata-web3";
import { env } from "./env";

export const pinata = new PinataSDK({
    pinataJwt: env.PINATA_JWT || "",
    pinataGateway: "example-gateway.mypinata.cloud", // Replace with your gateway if needed
});