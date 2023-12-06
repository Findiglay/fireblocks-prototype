import { FireblocksSDK } from "fireblocks-sdk";
const privateKey = process.env.FIREBLOCKS_PRIVATE_KEY!;
const apiKey = process.env.FIREBLOCKS_API_KEY!;

const fireblocks = new FireblocksSDK(
  privateKey,
  apiKey,
  "https://sandbox-api.fireblocks.io"
);

const assetId = "BTC_TEST";

export default fireblocks;
