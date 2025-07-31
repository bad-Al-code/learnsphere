"use server";

import { authService, userService } from "@/lib/api";
import { revalidatePath, revalidateTag } from "next/cache";
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
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
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

    return { success: true, email: validatedData.email };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}

const verifyEmailSchema = z
  .object({
    code: z.string().optional(),
    token: z.string().optional(),
    email: z.email(),
  })
  .refine((data) => data.code || data.token, {
    message: "Either a code or a token must be provided",
  });

type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export async function verifyEmail(values: VerifyEmailSchema) {
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

    const user = await getCurrentUser();
    if (user) {
      redirect("/");
    }

    return { success: true };
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
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
  email: z.email(),
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
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return { error: error.message || "An unexpected error occurred." };
  }
}

const resendVerificationEmailSchema = z.object({
  email: z.email(),
});

export async function resendVerificationEmail(
  values: z.infer<typeof resendVerificationEmailSchema>
) {
  try {
    const validatedData = resendVerificationEmailSchema.parse(values);
    const response = await authService.post(
      "/api/auth/resend-verification",
      validatedData
    );

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to resend email.";
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

export async function updatePassword(values: UpdatePasswordSchema) {
  try {
    const validatedData = updatePasswordSchema.parse(values);
    const response = await authService.patch(
      "/api/auth/update-password",
      validatedData
    );

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to update password.";
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: error.message || "An unexpected error occurred." };
  }
}

const verifyResetCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6),
});

export async function verifyResetCode(
  values: z.infer<typeof verifyResetCodeSchema>
) {
  try {
    const validatedData = verifyResetCodeSchema.parse(values);
    const response = await authService.post(
      "/api/auth/verify-reset-code",
      validatedData
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to verify code.";
      return { error: errorMessage };
    }

    return { success: true, token: responseData.token };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}

const verifyResetTokenSchema = z.object({
  email: z.string().email(),
  token: z.string().min(32),
});

export async function verifyResetToken(
  values: z.infer<typeof verifyResetTokenSchema>
) {
  try {
    const validatedData = verifyResetTokenSchema.parse(values);
    const response = await authService.post(
      "/api/auth/verify-reset-token",
      validatedData
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to verify token.";
      return { error: errorMessage };
    }

    return { success: true, token: responseData.token };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}

const setNewPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function setNewPassword(
  values: z.infer<typeof setNewPasswordSchema>
) {
  try {
    const validatedData = setNewPasswordSchema.parse(values);
    const response = await authService.post(
      "/api/auth/reset-password",
      validatedData
    );

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to set new password.";
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
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: error.message || "An unexpected error occurred." };
  }

  revalidatePath("/");
  redirect("/");
}

export async function getSessions(limit: number = 10) {
  try {
    const response = await authService.get(
      `/api/auth/sessions?limit=${limit}`,
      {
        next: { tags: ["sessions"] },
      }
    );

    if (!response.ok) {
      return { error: "Failed to fetch sessions." };
    }

    const data = await response.json();
    return { success: true, data: data.sessions };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function terminateSession(sessionId: string) {
  try {
    const response = await authService.delete(
      `/api/auth/sessions/${sessionId}`
    );
    if (!response.ok) {
      return { error: "Failed to terminate session." };
    }

    revalidateTag("sessions");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function terminateAllOtherSessions() {
  try {
    const response = await authService.delete(
      `/api/auth/sessions/all-except-current`
    );
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        error: data.errors?.[0]?.message || "Failed to terminate sessions.",
      };
    }

    revalidateTag("sessions");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}
