import { VideoPlayer } from "@/components/video-player/video-player";
import { getCurrentUser } from "./(auth)/actions";
import { HomepageClient } from "./(components)/homepage-client";

export default async function Home() {
  const user = await getCurrentUser();
  const testVideoUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

  return (
    <>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Welcome to LearnSphere</h1>
        <p className="mt-4">
          This is the homepage. Explore our courses and start learning!
        </p>

        <div className="container mt-4 max-w-4xl mx-auto">
          <VideoPlayer src={testVideoUrl} />
        </div>
      </main>

      <HomepageClient user={user} />
    </>
  );
}
