import { getCurrentUser } from "./(auth)/actions";
import { HomepageClient } from "./(components)/homepage-client";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Welcome to LearnSphere</h1>
        <p className="mt-4">
          This is the homepage. Explore our courses and start learning!
        </p>
      </main>

      <HomepageClient user={user} />
    </>
  );
}
