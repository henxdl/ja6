export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  let csrfToken = null;
  let session = null;

  try {
    const csrfResp = await fetch("https://launchpad.classlink.com/quickcard");
    const csrfText = await csrfResp.text();
    const cookies = csrfResp.headers.get('set-cookie');
    const session = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('clsession=')) : null;

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

  return new Response(JSON.stringify({ csrfToken, session }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
