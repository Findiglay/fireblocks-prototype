import Link from "next/link";
import prisma from "lib/prisma";
import { CreateUserForm } from "components/form";

async function getData() {
  const users = await prisma.user.findMany({
    include: {
      Assets: true,
    },
  });

  return users;
}

export default async function Home() {
  const users = await getData();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold underline my-4">Users</h1>
      <ul role="list" className="divide-y divide-gray-100">
        {users.map((user) => (
          <Link
            key={user.username}
            as="li"
            href={`/user/${user.username}`}
            className="flex justify-between gap-x-6 py-5"
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {user.username}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {user.Assets[0]?.address}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end">
              <p className="text-sm leading-6 text-gray-900">
                {user.Assets[0]?.assetType}
              </p>
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs leading-5 text-gray-500">
                  {user.Assets[0].balance}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </ul>

      <CreateUserForm />
    </div>
  );
}
