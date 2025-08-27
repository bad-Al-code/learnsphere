import { AuthorizationService } from '.';
import { MediaClient } from '../clients/media.client';
import { ResourceRepository } from '../db/repostiories';
import { NotFoundError } from '../errors';
import { CreateResourceDto, Resource, UpdateResourceDto } from '../schemas';
import { Requester } from '../types';

export class ResourceService {
  public static async getResourcesForCourse(
    courseId: string,
    requester: Requester,
    page: number,
    limit: number
  ) {
    await AuthorizationService.verifyCourseOwnership(courseId, requester);
    return ResourceRepository.findByCourseId(courseId, page, limit);
  }

  public static async createResource(
    courseId: string,
    data: CreateResourceDto,
    requester: Requester
  ): Promise<Resource> {
    await AuthorizationService.verifyCourseOwnership(courseId, requester);
    return ResourceRepository.create({ ...data, courseId });
  }

  public static async updateResource(
    resourceId: string,
    data: UpdateResourceDto,
    requester: Requester
  ): Promise<Resource> {
    const resource = await ResourceRepository.findById(resourceId);
    if (!resource) throw new NotFoundError('Resource');
    await AuthorizationService.verifyCourseOwnership(
      resource.courseId,
      requester
    );

    const updatedResource = await ResourceRepository.update(resourceId, data);
    if (!updatedResource) throw new NotFoundError('Resource');

    return updatedResource;
  }

  public static async deleteResource(
    resourceId: string,
    requester: Requester
  ): Promise<void> {
    const resource = await ResourceRepository.findById(resourceId);
    if (!resource) throw new NotFoundError('Resource');
    await AuthorizationService.verifyCourseOwnership(
      resource.courseId,
      requester
    );
    await ResourceRepository.delete(resourceId);
  }

  /**
   * Get a signed upload URL for uploading a course resource.
   * @param courseId - The course ID.
   * @param filename - The name of the file to upload.
   * @param requester - The user requesting the upload.
   * @returns The upload URL and metadata from the media service.
   * @throws Error if the requester does not own the course or media service fails.
   */
  public static async getUploadUrl(
    courseId: string,
    filename: string,
    requester: Requester
  ) {
    await AuthorizationService.verifyCourseOwnership(courseId, requester);

    return MediaClient.requestGenericFileUpload(
      courseId,
      filename,
      'course_resource'
    );
  }

  public static async getResourceForDownload(
    resourceId: string,
    requester: Requester
  ) {
    const resource = await ResourceRepository.findById(resourceId);
    if (!resource) throw new NotFoundError('Resource');

    await AuthorizationService.verifyCourseOwnership(
      resource.courseId,
      requester
    );

    return resource;
  }
}
