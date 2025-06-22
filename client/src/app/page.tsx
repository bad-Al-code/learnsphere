"use client";

import { trpc } from "@/lib/trpc/client";

export default function Home() {
  const { data, isLoading } = trpc.healthcheck.useQuery();
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold underline">LearnSphere Client</h1>
      <div className="mt-4">
        <p>tRPC Status:</p>
        {isLoading && <p>Loading...</p>}
        {data && (
          <p className="font-mono bg-slate-200 p-2 rounded">{data.message}</p>
        )}
      </div>
    </main>
  );
}
