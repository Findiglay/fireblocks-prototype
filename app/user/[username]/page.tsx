import prisma from "lib/prisma";
import fireblocks from "lib/fireblocks";
import { CreateUserForm } from "components/form";

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

  console.log("user: ", user);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold underline my-4">{user?.username}</h1>
      <h2>Address: {user?.Assets[0]?.address}</h2>
      {user?.Transactions?.map((tx) => {
        const event = JSON.parse((tx.eventData ?? "{}") as string) as any;

        return (
          <div key={tx.id}>
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
