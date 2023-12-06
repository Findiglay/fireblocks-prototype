import fireblocks from "lib/fireblocks";

export async function GET(request: Request) {
  const result = await fireblocks.resendWebhooks();

  console.log("result: ", result);
  return Response.json({ success: true });
}
