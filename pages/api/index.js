export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('i');
    const ip = request.headers.get("x-forwarded-for") || request.connection.remoteAddress;

    try {
        if (id) {
            await fetch("https://script.google.com/macros/s/AKfycbwYsHOJe4qOP-e1OZBjfSBNDep5Nz4LQ7Rge-xDjcGn7z7oKFPmgGfKk-Ey7eKFYBD2/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id, ip: ip })
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to post data" }), { status: 500 });
    }

    return Response.redirect("https://classroom.google.com/h", 302);
}
