import { AuthorizationService } from '.';
import { ResourceRepository } from '../db/repostiories';
import { NotFoundError } from '../errors';
import { CreateResourceDto, Resource, UpdateResourceDto } from '../schemas';
import { Requester } from '../types';

export class ResourceService {
  public static async getResourcesForCourse(
    courseId: string,
    requester: Requester
  ) {
    await AuthorizationService.verifyCourseOwnership(courseId, requester);
    return ResourceRepository.findByCourseId(courseId);
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
}
