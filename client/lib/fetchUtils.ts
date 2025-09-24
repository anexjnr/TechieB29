export async function parseResponse(res: Response) {
  if (!res) return null;
  try {
    // prefer json
    const ct = res.headers.get?.("content-type") || "";
    // use clone so callers can still read the original response if needed
    const cloned = res.clone();
    if (ct.includes("application/json")) {
      return await cloned.json();
    }
    const text = await cloned.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch (e) {
      return text;
    }
  } catch (e) {
    // if the body has already been consumed or other issue, return null
    console.error("parseResponse error:", e);
    return null;
  }
}
