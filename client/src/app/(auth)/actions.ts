"use server";

import { authService, userService } from "@/lib/api";
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

    const response = await authService.post("/api/auth/login", validatedData);
    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        responseData.errors?.[0]?.message || response.statusText;

      return { error: errorMessage };
    }

    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders.length > 0) {
      setCookieHeaders.forEach(async (cookieString) => {
        const [name, ...parts] = cookieString.split("=");
        const [value] = parts.join("=").split(";");

        const optionsString = parts.join("=").substring(value.length + 1);
        const options: any = {};
        optionsString.split(";").forEach((part) => {
          const [key, val] = part.trim().split("=");
          if (key.toLowerCase() === "expires") options.expires = new Date(val);
          if (key.toLowerCase() === "path") options.path = val;
          if (key.toLowerCase() === "samesite")
            options.sameSite = val.toLowerCase() as any;
          if (key.toLowerCase() === "httponly") options.httpOnly = true;
          if (key.toLowerCase() === "secure") options.secure = true;
        });

        (await cookies()).set(name, value, options);
      });
    }
  } catch (error: any) {
    return {
      error: error.message || "An unexpected error occurred. Please try again.",
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function getCurrentUser() {
  try {
    const response = await userService.get("/api/users/me");
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function logout() {
  try {
    const response = await authService.post("/api/auth/logout", {});
    const setCookieHeaders = response.headers.getSetCookie();

    if (setCookieHeaders.length > 0) {
      setCookieHeaders.forEach(async (cookieString) => {
        const [nameWithValue] = cookieString.split(";");
        const [name, value] = nameWithValue.split("=");
        (await cookies()).set(name, value, { expires: new Date(0), path: "/" });
      });
    }
  } catch (error) {
    console.error(
      "Logout API call failed, proceeding to clear cookies manually.",
      error
    );
  } finally {
    (await cookies()).delete("token");
    (await cookies()).delete("refreshToken");
    revalidatePath("/");
    redirect("/login");
  }
}

const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type SignupSchema = z.infer<typeof signupSchema>;

export async function signup(values: SignupSchema) {
  try {
    const validatedData = signupSchema.parse(values);

    const response = await authService.post("/api/auth/signup", validatedData);

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      const errorMessage =
        responseData.errors?.[0]?.message || response.statusText;
      return { error: errorMessage };
    }

    const setCookieHeaders = response.headers.getSetCookie();

    if (setCookieHeaders.length > 0) {
      setCookieHeaders.forEach(async (cookieString) => {
        const [name, ...parts] = cookieString.split("=");
        const [value] = parts.join("=").split(";");
        const optionsString = parts.join("=").substring(value.length + 1);

        const options: any = {};
        optionsString.split(";").forEach((part) => {
          const [key, val] = part.trim().split("=");
          if (key.toLowerCase() === "expires") options.expires = new Date(val);
          if (key.toLowerCase() === "path") options.path = val;
          if (key.toLowerCase() === "samesite")
            options.sameSite = val.toLowerCase() as any;
          if (key.toLowerCase() === "httponly") options.httpOnly = true;
          if (key.toLowerCase() === "secure") options.secure = true;
        });

        (await cookies()).set(name, value, options);
      });
    }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }

  redirect("/signup/verify-email");
}

const verifyEmailSchema = z.object({
  token: z.string(),
  email: z.string().email(),
});

export async function verifyEmail(values: z.infer<typeof verifyEmailSchema>) {
  try {
    const validatedData = verifyEmailSchema.parse(values);

    const response = await authService.post(
      "/api/auth/verify-email",
      validatedData
    );

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      const errorMessage =
        responseData.errors?.[0]?.message || "Verification failed.";
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function forgotPassword(
  values: z.infer<typeof forgotPasswordSchema>
) {
  try {
    const validatedData = forgotPasswordSchema.parse(values);
    const response = await authService.post(
      "/api/auth/forgot-password",
      validatedData
    );

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to send reset link.";
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}

const resetPasswordSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export async function resetPassword(values: ResetPasswordSchema) {
  const { ...dataToSend } = values;

  try {
    const validatedData = resetPasswordSchema.parse(dataToSend);
    const response = await authService.post(
      "/api/auth/reset-password",
      validatedData
    );

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to reset password.";
      return { error: errorMessage };
    }

    console.log("Password reset successful. Attempting auto-login...");

    const loginResult = await login({
      email: validatedData.email,
      password: validatedData.password,
    });
    if (loginResult?.error) {
      console.error(
        "Auto-login failed after password reset:",
        loginResult.error
      );

      return {
        success: true,
        error:
          "Could not log you in automatically. Please log in with your new password.",
      };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}
