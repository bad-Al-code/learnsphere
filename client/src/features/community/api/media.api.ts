import { mediaService } from '@/lib/api/client';

interface UploadUrlResponse {
  signedUrl: string;
  key: string;
}

export async function getChatAttachmentUploadUrl(
  filename: string,
  conversationId: string,
  senderId: string
): Promise<UploadUrlResponse> {
  const response = await mediaService.post<UploadUrlResponse>(
    '/api/media/request-upload-url',
    {
      filename,
      uploadType: 'chat_attachment',
      metadata: {
        conversationId,
        senderId,
      },
    }
  );

  console.log(response.data);
  return response.data;
}
