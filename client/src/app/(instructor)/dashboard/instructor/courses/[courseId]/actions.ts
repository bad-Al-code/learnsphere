"use server";

import { courseService } from "@/lib/api";
import { moduleSchema, ModuleSchemaValues } from "@/lib/schemas/module";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createModule(
  courseId: string,
  values: ModuleSchemaValues
) {
  try {
    const validatedData = moduleSchema.parse(values);

    const response = await courseService.post(
      `/api/courses/${courseId}/modules`,
      validatedData
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      throw new Error(data.errors?.[0]?.message || "Failed to create module.");
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/content`);
    return { success: true, data: await response.json() };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: error.message };
  }
}

export async function reorderModules(
  courseId: string,
  list: { id: string; order: number }[]
) {
  try {
    const ids = list.map((item) => item.id);
    const response = await courseService.post(`/api/modules/reorder`, { ids });

    if (!response.ok) {
      throw new Error("Failed to reorder modules.");
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
