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
const setCookieHeader = csrfResp.headers.get('set-cookie');
const regex = /clsession=([^;]+)/;
const match = setCookieHeader.match(regex);

if (match) {
  session = match[1];
}
const regex2 = /_csrf=([^;]+)/;
const match2 = setCookieHeader.match(regex2);

if (match2) {
  csrf = match2[1];
}

    const tokenMatch = csrfText.match(/var csrfToken = "(.*?)"/);
    csrfToken = tokenMatch ? tokenMatch[1] : null;

    if (!csrf) {
      throw new Error("CSRF token not found");
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "CSRF token retrieval failed", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ csrfToken:csrf, session }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
