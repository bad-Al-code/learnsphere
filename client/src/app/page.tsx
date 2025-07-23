import { ApiError, authService } from "@/lib/api";

export default async function Home() {
  let healthStatus = { status: "loading", message: "" };

  try {
    const data = await authService.get("/api/auth/health");
    healthStatus = data;
  } catch (error) {
    if (error instanceof ApiError) {
      healthStatus = {
        status: `Error ${error.status}`,
        message: error.message,
      };
    }

    console.error(error);
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Welcome to LearnSphere</h1>
      <div className="mt-8">
        <h2 className="text-xl font-semibold">API Health Check:</h2>
        <div className="mt-2 rounded-md bg-slate-100 p-4 dark:bg-slate-800">
          <p>
            <span className="font-semibold">Status:</span> {healthStatus.status}
          </p>
          <p>
            <span className="font-semibold">Message:</span>{" "}
            {healthStatus.message}
          </p>
        </div>
      </div>
    </main>
  );
}
