export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let csrfToken = null;
  try {
    const csrfResp = await fetch("https://launchpad.classlink.com/quickcard");
    const csrfText = await csrfResp.text();
    const tokenMatch = csrfText.match(/var csrfToken = "(.*?)"/);
    csrfToken = tokenMatch ? tokenMatch[1] : null;

    if (!csrfToken) {
      throw new Error("CSRF token not found");
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "CSRF token retrieval failed", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ csrfToken }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
