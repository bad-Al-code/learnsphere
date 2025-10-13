import { HomepageClient } from '@/components/shared/homepage-client';
import { getCurrentUser } from './(auth)/actions';
import WaitlistPage from './waitlist/page';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <main className="container mx-auto space-y-4">
        <WaitlistPage />
      </main>

      <HomepageClient user={user} />
    </>
  );
}
