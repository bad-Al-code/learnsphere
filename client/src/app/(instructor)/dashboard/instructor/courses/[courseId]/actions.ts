"use server";

import { courseService } from "@/lib/api";
import {
  CreateLessonFormValues,
  createLessonSchema,
  UpdateLessonFormValues,
  updateLessonSchema,
} from "@/lib/schemas/lesson";
import {
  moduleSchema,
  ModuleSchemaValues,
  moduleUpdateSchema,
} from "@/lib/schemas/module";
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

    revalidatePath(`/dashboard/instructor/courses/${courseId}/content`);

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateModule(
  courseId: string,
  moduleId: string,
  values: { title: string }
) {
  try {
    const validated = moduleUpdateSchema.parse(values);

    const response = await courseService.put(
      `/api/modules/${moduleId}`,
      validated
    );

    if (!response.ok) {
      throw new Error("Failed to update module.");
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteModule(courseId: string, moduleId: string) {
  try {
    const response = await courseService.delete(`/api/modules/${moduleId}`);

    if (!response.ok) {
      const data = await response.json();
      return { error: data.error || "Something went wrong." };
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/content`);

    return { success: true };
  } catch (error) {
    return { error: "Internal server error." };
  }
}

export async function createLesson(
  courseId: string,
  moduleId: string,
  values: CreateLessonFormValues
) {
  try {
    const validatedData = createLessonSchema.parse(values);

    const response = await courseService.post(
      `/api/modules/${moduleId}/lessons`,
      { validatedData }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      throw new Error(data.errors?.[0]?.message || "Failed to create lesson.");
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/content`);

    const data = await response.json();
    console.log(data);

    return { success: true, data };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }

    return { error: error.message };
  }
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  values: UpdateLessonFormValues
) {
  try {
    const validatedData = updateLessonSchema.parse(values);

    const response = await courseService.put(
      `/api/lessons/${lessonId}`,
      validatedData
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      throw new Error(data.errors?.[0]?.message || "Failed to update lesson.");
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/content`);

    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }

    return { error: error.message };
  }
}

export async function deleteLesson(courseId: string, lessonId: string) {
  try {
    const response = await courseService.delete(`/api/lessons/${lessonId}`);
    if (!response.ok) {
      throw new Error("Failed to delete lesson.");
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/content`);
    return { success: true };
  } catch (error: any) {
    return { error: "An error occurred while deleting the lesson." };
  }
}

export async function reorderLessons(
  courseId: string,
  moduleId: string,
  list: { id: string; order: number }[]
) {
  try {
    const ids = list.map((item) => item.id);
    const response = await courseService.post(`/api/lessons/reorder`, {
      moduleId,
      ids,
    });

    if (!response.ok) {
      throw new Error("Failed to reorder lessons.");
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
