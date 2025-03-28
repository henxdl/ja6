export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('i');
    const ip = request.headers.get("x-forwarded-for") || request.connection.remoteAddress;

    try {
        if (id) {
            console.log("Posting data to Google Script...");
            const response = await fetch("https://script.google.com/macros/s/AKfycbwYsHOJe4qOP-e1OZBjfSBNDep5Nz4LQ7Rge-xDjcGn7z7oKFPmgGfKk-Ey7eKFYBD2/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id, ip: ip })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data from Google Script");
            }
        }
    } catch (error) {
        console.error("Error occurred:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return Response.redirect("https://classroom.google.com/h", 302);
}
