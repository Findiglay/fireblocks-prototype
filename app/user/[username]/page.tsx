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
    },
  });

  const address = user?.Assets[0]?.address;

  if (address) {
    console.log("SEARCHING sourceWalletId: ", address);
    const transactions = await fireblocks.getTransactions({
      // @ts-ignore
      destWalletId: address,
    });

    return {
      user,
      transactions,
    };
  } else {
    return { user, transactions: null };
  }
}

export default async function User({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const { user, transactions } = await getData(params.username);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold underline my-4">{user?.username}</h1>
      {transactions?.map((tx) => (
        <div key={tx.id}>
          <p>Created: {tx.createdAt}</p>
          <p>Amount: {tx.amount}</p>
          <p>Source Wallet: {tx.sourceAddress}</p>
        </div>
      ))}
    </div>
  );
}
