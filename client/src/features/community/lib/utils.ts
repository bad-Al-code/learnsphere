import { MediaAttachment } from '../types';

export const parseMessageContent = (
  content: string
): { isMedia: boolean; data: MediaAttachment | string } => {
  try {
    const parsed = JSON.parse(content);

    if (parsed && (parsed.type === 'file' || parsed.type === 'image')) {
      const mimeType = parsed.mimeType || '';

      return {
        isMedia: true,
        data: {
          ...parsed,
          // if type is explicitly "image" OR mimeType starts with image
          type:
            parsed.type === 'image' || mimeType.startsWith('image/')
              ? 'image'
              : 'file',
        },
      };
    }
  } catch (e) {
    // not JSON → treat as plain text
  }

  return { isMedia: false, data: content };
};
