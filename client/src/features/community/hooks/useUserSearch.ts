import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../api/user.api';

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ['user-search', query],
    queryFn: () => searchUsers(query),
    enabled: !!query && query.length > 2,
    staleTime: 1000 * 60 * 5,
  });
}
