const VERSION_ENV_KEYS = [
  "SOURCE_COMMIT",
  "VERCEL_GIT_COMMIT_SHA",
  "CF_PAGES_COMMIT_SHA",
  "RAILWAY_GIT_COMMIT_SHA",
  "RENDER_GIT_COMMIT",
  "COMMIT_REF",
  "GIT_HASH",
] as const;

function getVersion(env: NodeJS.ProcessEnv): string {
  for (const key of VERSION_ENV_KEYS) {
    const value = env[key];
    if (value && typeof value === "string") {
      return value;
    }
  }
  if (process.env.NODE_ENV === "development") {
    return "dev";
  }
  return new Date().toISOString();
}

export const dynamic = "force-static";

export async function GET() {
  const version = getVersion(process.env);
  return new Response(version, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
