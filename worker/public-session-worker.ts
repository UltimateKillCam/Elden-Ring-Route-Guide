import { handleSessionApi, SESSION_CORS_HEADERS } from "./session-api";

interface Env {
  DB: D1Database;
}

const worker = {
  fetch(request: Request, env: Env) {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/api/sessions" || pathname.startsWith("/api/sessions/")) {
      return handleSessionApi(request, env.DB);
    }
    return Response.json({ error: "Session endpoint not found" }, { status: 404, headers: SESSION_CORS_HEADERS });
  },
};

export default worker;
