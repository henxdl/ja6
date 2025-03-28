export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const searchParams = url.search;

    // Regex to extract the 'id' parameter value
    const idMatch = searchParams.match(/[?&]i=([^&]+)/);
    const id = idMatch ? idMatch[1] : null;  // If a match is found, extract the value

    const ip = request.headers.get("x-forwarded-for") || request.connection.remoteAddress;

    try {
        if (id) {
            const response = await fetch("https://script.google.com/macros/s/AKfycbwYsHOJe4qOP-e1OZBjfSBNDep5Nz4LQ7Rge-xDjcGn7z7oKFPmgGfKk-Ey7eKFYBD2/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id, ip: ip })
            });

            if (!response.ok) {
                return new Response(JSON.stringify({ error: "Google Script failed" }), { status: 500 });
            }
        } else {
            return new Response(JSON.stringify({ error: "ID parameter missing" }), { status: 400 });
        }
    } catch (error) {
        console.error("Error during request:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }

    return Response.redirect("https://classroom.google.com/h", 302);
}
