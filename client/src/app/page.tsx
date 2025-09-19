import { HomepageClient } from '@/components/shared/homepage-client';
import AiTools from '../features/ai-tools/page';
import { getCurrentUser } from './(auth)/actions';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <main className="container mx-auto space-y-4">
        <AiTools />
      </main>

      <HomepageClient user={user} />
    </>
  );
}
