import { HomepageClient } from '@/components/shared/homepage-client';
import { StatCardGrid } from './(app)/dashboard/students/_components/student-minit-stat-card';
import { getCurrentUser } from './(auth)/actions';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Welcome to LearnSphere</h1>
        <p className="mt-4">
          This is the homepage. Explore our courses and start learning!
        </p>

        <div className="mt-6 grid grid-cols-1 space-x-4 md:grid-cols-2"></div>
        <StatCardGrid />
      </main>

      <HomepageClient user={user} />
    </>
  );
}
