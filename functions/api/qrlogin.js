async function handleRequest(request) {
  try {
    // Parse the URL and parameters
    const { code, os, browser, res } = await request.json();

    // Fetch the CSRF token from the ClassLink endpoint
    const response = await fetch("https://launchpad.classlink.com/quickcard");
    const data = await response.text();
    const csrfTokenMatch = data.match(/var csrfToken = "(.*?)"/);
    const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : null;

    if (!csrfToken) {
      return new Response(JSON.stringify({ error: "CSRF token not found" }), { status: 400 });
    }

    // Send a POST request with the CSRF token and other data
    const postResponse = await fetch("/qrlogin", {
      method: "POST",
      headers: {
        "csrf-token": csrfToken || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        OS: os,
        Browser: browser,
        Resolution: res,
        LoginSourceId: 7,
      }),
    });

    const r = await postResponse.json();

    if (r && r.error && r.custom && r.custom.error_code === "not_found") {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    } else if (r && r.status && parseInt(r.status) === 3) {
      const token = r.token;
      return new Response(JSON.stringify({ redirect: `/login/twoformauth/${token}` }), { status: 200 });
    } else if (r && parseInt(r.status) === 4) {
      const token = r.token;
      return new Response(JSON.stringify({ redirect: `/login/settwoformauth/${token}` }), { status: 200 });
    }

    if (!r || !r.status || !r.url) {
      return new Response(JSON.stringify({ error: "QuickCard Login Failed" }), { status: 500 });
    }

    return new Response(JSON.stringify({ url: r.url }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
