/**
 * Calls Next.js revalidation API so the frontend cache is cleared after CMS updates.
 * Fire-and-forget: does not throw; logs errors only.
 */
export async function revalidateNextjs(options: { path?: string; tag?: string }): Promise<void> {
  const { path, tag } = options;
  if (!path && !tag) return;

  const url = process.env.NEXTJS_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) {
    console.warn("Revalidation skipped: NEXTJS_SITE_URL or REVALIDATE_SECRET missing");
    return;
  }

  try {
    const baseUrl = url.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        ...(path && { path }),
        ...(tag && { tag }),
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      console.error("Revalidation failed:", res.status, data.message || res.statusText);
    }
  } catch (err) {
    console.error("Revalidation request error:", err);
  }
}
