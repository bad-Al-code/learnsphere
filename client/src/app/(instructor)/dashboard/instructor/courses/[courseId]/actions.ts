'use server';

import { courseService } from '@/lib/api';
import { FindAssignmentsQuery } from '@/lib/schemas/assignment';
import {
  LessonFormValues,
  lessonSchema,
  UpdateLessonFormValues,
  updateLessonSchema,
} from '@/lib/schemas/lesson';
import {
  moduleSchema,
  ModuleSchemaValues,
  moduleUpdateSchema,
} from '@/lib/schemas/module';
import {
  CreateResourceDto,
  createResourceSchema,
} from '@/lib/schemas/resource';
import { revalidatePath } from 'next/cache';
import z from 'zod';

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

      throw new Error(data.errors?.[0]?.message || 'Failed to create module.');
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
      throw new Error('Failed to reorder modules.');
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
      throw new Error('Failed to update module.');
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
      return { error: data.error || 'Something went wrong.' };
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/content`);

    return { success: true };
  } catch (error) {
    return { error: 'Internal server error.' };
  }
}

export async function createLesson(
  courseId: string,
  moduleId: string,
  values: LessonFormValues
) {
  try {
    const validatedData = lessonSchema.parse(values);

    const response = await courseService.post(
      `/api/modules/${moduleId}/lessons`,
      validatedData
    );

    if (!response.ok) {
      throw new Error('Failed to create lesson.');
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

      throw new Error(data.errors?.[0]?.message || 'Failed to update lesson.');
    }

    revalidatePath(
      `/dashboard/instructor/courses/${courseId}/modules/${(await getLessonDetails(lessonId))?.moduleId}`
    );

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
      throw new Error('Failed to delete lesson.');
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/content`);
    return { success: true };
  } catch (error: any) {
    return { error: 'An error occurred while deleting the lesson.' };
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
      throw new Error('Failed to reorder lessons.');
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getModuleDetails(moduleId: string) {
  try {
    const response = await courseService.get(`/api/modules/${moduleId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function getLessonDetails(lessonId: string) {
  try {
    const response = await courseService.get(`/api/lessons/${lessonId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function getLessonVideoUploadUrl(
  lessonId: string,
  filename: string
) {
  try {
    const response = await courseService.post(
      `/api/lessons/${lessonId}/request-video-upload`,
      { filename }
    );
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.errors?.[0]?.message || 'Could not get upload URL.');
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}

const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
});

const updateAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required.').optional(),
  description: z.string().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
});

export async function createAssignment(
  courseId: string,
  moduleId: string,
  values: z.infer<typeof createAssignmentSchema>
) {
  try {
    const validatedData = createAssignmentSchema.parse(values);
    const response = await courseService.post(
      `/api/modules/${moduleId}/assignments`,
      validatedData
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(
        data.errors?.[0]?.message || 'Failed to create assignment.'
      );
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/assignments`);
    return { success: true, data: await response.json() };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: error.message };
  }
}

export async function updateAssignment(
  courseId: string,
  assignmentId: string,
  values: z.infer<typeof updateAssignmentSchema>
) {
  try {
    const validatedData = updateAssignmentSchema.parse(values);
    const response = await courseService.put(
      `/api/assignments/${assignmentId}`,
      validatedData
    );

    if (!response.ok) {
      throw new Error('Failed to update assignment.');
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/assignments`);
    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: error.message };
  }
}

export async function deleteAssignment(courseId: string, assignmentId: string) {
  try {
    const response = await courseService.delete(
      `/api/assignments/${assignmentId}`
    );
    if (!response.ok) {
      throw new Error('Failed to delete assignment.');
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/assignments`);
    return { success: true };
  } catch (error: any) {
    return { error: 'An error occurred while deleting the assignment.' };
  }
}

export async function reorderAssignments(
  courseId: string,
  moduleId: string,
  list: { id: string; order: number }[]
) {
  try {
    const ids = list.map((item) => item.id);
    const response = await courseService.post(`/api/assignments/reorder`, {
      moduleId,
      items: list,
    });

    if (!response.ok) {
      throw new Error('Failed to reorder assignments.');
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getCourseAssignments(options: FindAssignmentsQuery) {
  try {
    const params = new URLSearchParams();

    if (options.q) params.set('q', options.q);
    if (options.status) params.set('status', options.status);
    if (options.moduleId) params.set('moduleId', options.moduleId);
    if (options.page) params.set('page', String(options.page));
    if (options.limit) params.set('limit', String(options.limit));

    const response = await courseService.get(
      `/api/courses/${options.courseId}/assignments?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch assignments.');
    }

    const result = await response.json();

    return result;
  } catch (error: any) {
    console.error('Error fetching course assignments:', error);
    return {
      results: [],
      pagination: { currentPage: 1, totalPages: 0, totalResults: 0 },
    };
  }
}

export async function getCourseResources(courseId: string) {
  try {
    const response = await courseService.get(
      `/api/courses/${courseId}/resources`
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    return [];
  }
}

export async function createResource(
  courseId: string,
  values: CreateResourceDto
) {
  try {
    const validatedData = createResourceSchema.parse(values);
    const response = await courseService.post(
      `/api/courses/${courseId}/resources`,
      validatedData
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(
        data.errors?.[0]?.message || 'Failed to create resource.'
      );
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/assignments`);
    return { success: true, data: await response.json() };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: error.message };
  }
}

export async function deleteResource(courseId: string, resourceId: string) {
  try {
    const response = await courseService.delete(`/api/resources/${resourceId}`);
    if (!response.ok) {
      throw new Error('Failed to delete resource.');
    }

    revalidatePath(`/dashboard/instructor/courses/${courseId}/assignments`);
    return { success: true };
  } catch (error: any) {
    return { error: 'An error occurred.' };
  }
}

export async function getResourceUploadUrl(courseId: string, filename: string) {
  try {
    const response = await courseService.post(
      `/api/courses/${courseId}/resources/upload-url`,
      { filename }
    );
    if (!response.ok) {
      throw new Error('Could not get upload URL.');
    }
    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { error: error.message };
  }
}
