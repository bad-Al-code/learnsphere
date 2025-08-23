import { HomepageClient } from '@/components/shared/homepage-client';
import CommunicationPage, {
  CommunicationPageSkeleton,
} from './(app)/dashboard/communication/page';
import { getCurrentUser } from './(auth)/actions';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <main className="container mx-auto space-y-4 p-4">
        <CommunicationPage />
        <CommunicationPageSkeleton />
      </main>

      <HomepageClient user={user} />
    </>
  );
}
