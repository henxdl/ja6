export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const os = url.searchParams.get("os");
  const browser = url.searchParams.get("browser");
  const res = url.searchParams.get("res");

  if (!code || !os || !browser || !res) {
    return new Response(JSON.stringify({ error: "Missing query parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const csrfResp = await fetch("https://launchpad.classlink.com/quickcard");
    const csrfText = await csrfResp.text();
    const tokenMatch = csrfText.match(/var csrfToken = "(.*?)"/);
    const csrfToken = tokenMatch ? tokenMatch[1] : null;

    if (!csrfToken) {
      return new Response(JSON.stringify({ error: "CSRF token not found" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const qrResp = await fetch("https://launchpad.classlink.com/qrlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
      body: JSON.stringify({
        code,
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
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
