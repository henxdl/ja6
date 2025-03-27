export default async function handler(req, res) {
    const { id } = req.query;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    
    if (!n) {
        res.writeHead(302, { Location: "https://www.google.com" });
    }
    
    try {
        await fetch("https://example.com/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id, ip: ip })
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to post data" });
    }
    
    res.writeHead(302, { Location: "https://www.google.com" });
    res.end();
}
