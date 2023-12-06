"use server";

import { revalidatePath } from "next/cache";

export async function createUser(_currentState: any, formData: FormData) {
  try {
    const response = await fetch("http://localhost:3000/api/user/create", {
      method: "POST",
      body: JSON.stringify({
        username: formData.get("username"),
      }),
    });
    const data = await response.json();
    revalidatePath("/");
    return "User created";
  } catch (err) {
    console.error(err);
    return err instanceof Error ? err.message : "Failed to create user";
  }
}
