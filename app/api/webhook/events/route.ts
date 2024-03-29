import type { TransactionResponse } from "fireblocks-sdk";
import prisma from "lib/prisma";

type TransactionTypes =
  | "TRANSACTION_CREATED"
  | "TRANSACTION_STATUS_UPDATED"
  | "TRANSACTION_APPROVAL_STATUS_UPDATED";

type TransactionWebhook = {
  type: TransactionTypes;
  tenantId: string;
  timestamp: number;
  data: TransactionResponse;
};

export async function POST(request: Request) {
  const json: TransactionWebhook = await request.json();
  const transaction = json.data;

  console.log(JSON.stringify(json, null, 2));

  if (transaction.destinationAddressDescription?.includes("CustomerID")) {
    if (
      json.type === "TRANSACTION_STATUS_UPDATED" &&
      transaction.status === "COMPLETED"
    ) {
      const amount = transaction.amount;

      await prisma.asset.update({
        where: {
          address: transaction.destinationAddress,
        },
        data: {
          balance: {
            increment: Number(amount),
          },
        },
      });
    }

    await prisma.transaction.upsert({
      where: {
        id: transaction.id,
      },
      create: {
        id: transaction.id,
        eventData: JSON.stringify(transaction),
        user: {
          connect: {
            username: transaction.destinationAddressDescription.split("_")[1],
          },
        },
      },
      update: {
        eventData: JSON.stringify(transaction),
      },
    });
  }

  return Response.json({ success: true });
}

/*
{
  "type": "TRANSACTION_CREATED",
  "tenantId": "d145cb3e-6348-4b67-94e6-3ada55eab4d5",
  "timestamp": 1701872691824,
  "data": {
    "id": "6409f2b0-4103-4c09-bdc9-f035c41c0f0a",
    "createdAt": 1701872681606,
    "lastUpdated": 1701872681657,
    "assetId": "BTC_TEST",
    "source": {
      "id": "",
      "type": "UNKNOWN",
      "name": "External",
      "subType": ""
    },
    "destination": {
      "id": "2",
      "type": "VAULT_ACCOUNT",
      "name": "Omnibus",
      "subType": ""
    },
    "amount": 0.00001,
    "networkFee": 0.00000141,
    "netAmount": 0.00001,
    "sourceAddress": "tb1qgn7gqssyaja2rxpgh77dndrwgzqv8dguz3m8g9",
    "destinationAddress": "tb1q5hu0wnuqh662kjaznmhqj5e87ycfahl73sfmu2",
    "destinationAddressDescription": "CustomerID_grantf_vault",
    "destinationTag": "",
    "status": "CONFIRMING",
    "txHash": "e52f4e73461f7602e81f84a7ccf3d3dd6cb1501cc2746055feea109698571fd9",
    "subStatus": "PENDING_BLOCKCHAIN_CONFIRMATIONS",
    "signedBy": [],
    "createdBy": "",
    "rejectedBy": "",
    "amountUSD": 0.44,
    "addressType": "",
    "note": "",
    "exchangeTxId": "",
    "requestedAmount": 0.00001,
    "feeCurrency": "BTC_TEST",
    "operation": "TRANSFER",
    "customerRefId": null,
    "numOfConfirmations": 0,
    "amountInfo": {
      "amount": "0.00001",
      "requestedAmount": "0.00001",
      "netAmount": "0.00001",
      "amountUSD": "0.44"
    },
    "feeInfo": {
      "networkFee": "0.00000141"
    },
    "destinations": [],
    "externalTxId": null,
    "blockInfo": {
      "blockHash": null
    },
    "signedMessages": [],
    "index": 1,
    "assetType": "BASE_ASSET"
  }
}
*/
