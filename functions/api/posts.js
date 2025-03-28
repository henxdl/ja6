export async function onRequest(context) {
    return new Response('Hello from API!', { status: 200 });
}
