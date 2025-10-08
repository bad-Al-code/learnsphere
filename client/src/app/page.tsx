import Waitlist from '@/components/landing/Waitlist';
import { HomepageClient } from '@/components/shared/homepage-client';
import { getCurrentUser } from './(auth)/actions';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <main className="container mx-auto space-y-4">
        <Waitlist />
      </main>

      <HomepageClient user={user} />
    </>
  );
}
