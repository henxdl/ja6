export default async function handler(req, res) {
    const { n } = req.query;
    
    if (!n) {
        return res.status(400).json({ error: "Missing 'n' query parameter" });
    }
    
    try {
        await fetch("https://example.com/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: n })
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to post data" });
    }
    
    res.writeHead(302, { Location: "https://www.google.com" });
    res.end();
}
