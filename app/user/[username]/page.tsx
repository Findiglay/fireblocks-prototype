import prisma from "lib/prisma";

async function getData(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      Assets: true,
      Transactions: true,
    },
  });

  return { user };
}

export default async function User({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const { user } = await getData(params.username);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold underline my-4">{user?.username}</h1>
      <h2>Address: {user?.Assets[0]?.address}</h2>
      <h2>Balance: {user?.Assets[0]?.balance}</h2>

      <h3 className="mt-6 font-bold">Transactions</h3>
      {user?.Transactions?.map((tx) => {
        const event = JSON.parse((tx.eventData ?? "{}") as string) as any;

        return (
          <div key={tx.id} className="my-2">
            <p>Created: {event?.createdAt}</p>
            <p>Amount: {event?.amount}</p>
            <p>Status: {event?.status}</p>
            <p>Tx Hash: {event?.txHash}</p>
          </div>
        );
      })}
    </div>
  );
}
