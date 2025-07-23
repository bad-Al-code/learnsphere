"use server";

import { ApiError, authService, userService } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email" }),
  password: z.string().min(1, { error: "Password is required" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export async function login(values: LoginSchema) {
  try {
    const validatedData = loginSchema.parse(values);

    await authService.post("/api/auth/login", validatedData);
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath("/");
  redirect("/");
}

export async function getCurrentUser() {
  try {
    const user = await userService.get("/api/users/me");
    return user;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  try {
    await authService.post("/api/auth/logout", {});
  } catch (error) {
    console.error(
      "Logout API call failed, proceeding to clear cookies.",
      error
    );
  } finally {
    (await cookies()).delete("token");
    (await cookies()).delete("refreshToken");
    revalidatePath("/");
    redirect("/login");
  }
}
