import { HomepageClient } from '@/components/shared/homepage-client';
import CommunicationPage from './(app)/dashboard/communication/page';
import TestPage from './(app)/dashboard/communication2/page';
import { getCurrentUser } from './(auth)/actions';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <main className="container mx-auto p-4">
        <TestPage />
        <div className="mt-4"></div>
        <CommunicationPage />
        <div className="mt-4">{/* <TestVideoPlayer /> */}</div>
        {/**/}
        {/* <div className="mt-10"></div> */}
        {/* <div className="mt-10"></div> */}
        {/**/}
        {/* <TestTextEditor /> */}
        {/* <div className="mt-10"></div> */}
        {/**/}
        {/* <RichTextEditorSkeleton /> */}
      </main>

      <HomepageClient user={user} />
    </>
  );
}
