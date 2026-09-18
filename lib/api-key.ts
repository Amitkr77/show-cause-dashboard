export function verifyApiKey(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === process.env.INTEGRATION_API_KEY;
}
