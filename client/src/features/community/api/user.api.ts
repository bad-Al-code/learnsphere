import { userService } from '@/lib/api/client';
import { PaginatedResponse, UserSearchResult } from '../types';

export async function searchUsers(
  query: string
): Promise<PaginatedResponse<UserSearchResult>> {
  const url = `/api/users/search?q=${encodeURIComponent(query)}&limit=10`;

  const response =
    await userService.get<PaginatedResponse<UserSearchResult>>(url);

  return response.data;
}
