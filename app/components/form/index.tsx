"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "./submit";
import { createUser } from "../../actions";

export async function CreateUserForm() {
  const [message, formAction] = useFormState(createUser, null);

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      action={formAction}
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Username"
          autoComplete="off"
        />
      </div>
      <div className="flex items-start">
        <SubmitButton />
        <p aria-live="polite" className="sr-only" role="status">
          {message}
        </p>
      </div>
    </form>
  );
}
