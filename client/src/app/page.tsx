import { HomepageClient } from '@/components/shared/homepage-client';
import { ChatInterface } from '@/features/community/components/ChatInterface';
import { getCurrentUser } from './(auth)/actions';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <main className="container mx-auto space-y-4">
        <ChatInterface />
      </main>

      <HomepageClient user={user} />
    </>
  );
}
