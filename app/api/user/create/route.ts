import { AssetType } from "@prisma/client";
import prisma from "lib/prisma";
import fireblocks from "lib/fireblocks";

export const dynamic = "force-dynamic"; // defaults to force-static
export async function POST(request: Request) {
  const json = await request.json();
  const username = json.username;

  if (typeof username !== "string") {
    return Response.json({ error: "Invalid username" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return Response.json({ error: "User already exists" }, { status: 400 });
  }

  const addressResponse = await fireblocks.generateNewAddress(
    "2",
    "BTC_TEST",
    "CustomerID_" + username + "_vault"
  );

  console.log("addressResponse", addressResponse);

  const user = await prisma.user.create({
    data: {
      username,
      Assets: {
        create: {
          assetType: AssetType.BTC_TEST,
          address: addressResponse.address,
          balance: 0,
        },
      },
    },
  });

  return Response.json({ user });
}
