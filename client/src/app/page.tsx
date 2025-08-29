import { HomepageClient } from '@/components/shared/homepage-client';
import { getCurrentUser } from './(auth)/actions';
import NotFound, { NotFoundSkeleton } from './not-found';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <main className="container mx-auto space-y-4 p-4">
        <NotFound />
        <NotFoundSkeleton />
      </main>

      <HomepageClient user={user} />
    </>
  );
}
