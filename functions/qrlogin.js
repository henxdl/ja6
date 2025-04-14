export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  let session, csrfToken, csrf;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON body", details: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { code, os, browser, res } = body;

  if (!code || !os || !browser || !res) {
    return new Response(JSON.stringify({ error: "Missing body parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const csrfResp = await fetch("https://ja6.pages.dev/getcsrf");
    const csrfData = await csrfResp.json();
    ({ csrf, csrfToken, session } = csrfData);
    

    if (!csrfToken) {
      throw new Error("CSRF token retrieval failed");
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to retrieve CSRF token", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
const cookieString = "_csrf="+csrf+"; clsession="+session;

  try {
    const qrResp = await fetch("https://launchpad.classlink.com/qrlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieString,
        "csrf-token": csrfToken
      },
      body: JSON.stringify({
        code: code,
        OS: os,
        Browser: browser,
        Resolution: res,
        LoginSourceId: 7,
      }),
    });

    const r = await qrResp.json();

    if (r?.error?.custom?.error_code === "not_found") {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (parseInt(r?.status) === 3) {
      return new Response(JSON.stringify({ redirect: `/login/twoformauth/${r.token}` }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (parseInt(r?.status) === 4) {
      return new Response(JSON.stringify({ redirect: `/login/settwoformauth/${r.token}` }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!r?.status || !r?.url) {
      return new Response(JSON.stringify({ error: "QuickCard Login Failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: r.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
