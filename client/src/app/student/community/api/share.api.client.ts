import {
  communityService as clientCommunityService,
  userService as clientUserService,
  notificationService,
} from '@/lib/api/client';
import {
  BulkInviteInput,
  EmailInviteInput,
  InviteUsersInput,
  SearchedUser,
} from '../schema';

export const sendEmailInvites = async (
  data: EmailInviteInput & { linkUrl: string }
): Promise<{ message: string }> => {
  const payload = {
    ...data,
    emails: data.emails
      .split('\n')
      .map((e) => e.trim())
      .filter(Boolean),
  };

  const response = await notificationService.post<{ message: string }>(
    '/api/notifications/email-invite',
    payload
  );

  return response.data;
};

export const searchUsers = async (query: string): Promise<SearchedUser[]> => {
  if (query.length < 2) return [];
  const response = await clientUserService.get<SearchedUser[]>(
    `/api/users/search-users?q=${query}`
  );

  const data = response.data;
  console.log(data);
  return data;
};

export const inviteUsers = async (
  data: InviteUsersInput
): Promise<{ message: string }> => {
  const response = await clientCommunityService.post<{ message: string }>(
    `/api/community/study-rooms/${data.roomId}/invite-users`,
    { userIds: data.userIds }
  );

  return response.data;
};

export const sendBulkInvites = async (
  data: BulkInviteInput
): Promise<{ message: string }> => {
  const response = await notificationService.post<{ message: string }>(
    '/api/notifications/bulk-invite',
    data
  );

  return response.data;
};
