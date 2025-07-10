import { MediaService, UploadUrlParams } from '../services/media.service';

export class MediaController {
  public static async getUploadUrl(params: UploadUrlParams) {
    return MediaService.getUploadUrl(params);
  }
}
