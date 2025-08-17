import { HomepageClient } from '@/components/shared/homepage-client';
import {
  AllStudentsTable,
  AllStudentsTableSkeleton,
} from './(app)/_components/all-students-table';
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

        <div className="mt-6 space-y-4">
          <AllStudentsTable />
          <AllStudentsTableSkeleton />
        </div>
      </main>

      <HomepageClient user={user} />
    </>
  );
}
