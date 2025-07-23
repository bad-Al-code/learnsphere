"use server";

import { ApiError, authService } from "@/lib/api";
import { revalidatePath } from "next/cache";
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
