// 墨记单词 后端 API：账号登录 + 学习进度云同步（Cloudflare Worker + KV）
// 端点：
//   POST /register {username,password}  注册，返回 {token,username}
//   POST /login    {username,password}  登录，返回 {token,username}
//   GET  /data      (Authorization: Bearer <token>)          取云端进度 {data,updatedAt}
//   PUT  /data      (Authorization) {data}                   存云端进度 {ok,updatedAt}
// 安全：密码用 PBKDF2-SHA256 加盐哈希存储，绝不明文；token 为 HMAC 签名，7 天有效。

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};
const enc = s => new TextEncoder().encode(s);
const toHex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
const fromHex = h => new Uint8Array(h.match(/.{1,2}/g).map(x => parseInt(x, 16)));
const b64url = bytes => btoa(String.fromCharCode(...bytes)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
const unb64url = s => { s = s.replace(/-/g, "+").replace(/_/g, "/"); return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}

async function hashPassword(password, saltHex) {
  const salt = saltHex ? fromHex(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  return { salt: toHex(salt), hash: toHex(bits) };
}

async function makeToken(username, secret) {
  const payload = { u: username, exp: Date.now() + 7 * 864e5 };
  const body = b64url(enc(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey("raw", enc(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc(body));
  return body + "." + b64url(new Uint8Array(sig));
}

async function readToken(token, secret) {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const key = await crypto.subtle.importKey("raw", enc(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("HMAC", key, unb64url(sig), enc(body));
  if (!ok) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(unb64url(body)));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (e) { return null; }
}

function normUser(u) { return String(u || "").trim().toLowerCase(); }
function validUser(u) { return /^[a-z0-9_]{3,30}$/.test(u); }

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const SECRET = env.JWT_SECRET || "dev-insecure-secret";
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "");

    try {
      // ---- 注册 / 登录 ----
      if (request.method === "POST" && (path === "/register" || path === "/login")) {
        const { username, password } = await request.json().catch(() => ({}));
        const u = normUser(username);
        if (!validUser(u)) return json({ error: "用户名需为 3-30 位字母/数字/下划线" }, 400);
        if (!password || String(password).length < 6) return json({ error: "密码至少 6 位" }, 400);

        const userKey = "user:" + u;
        const existing = await env.VOCAB_KV.get(userKey, "json");

        if (path === "/register") {
          if (existing) return json({ error: "用户名已被注册" }, 409);
          const { salt, hash } = await hashPassword(password);
          await env.VOCAB_KV.put(userKey, JSON.stringify({ salt, hash, createdAt: Date.now() }));
          return json({ token: await makeToken(u, SECRET), username: u });
        } else {
          if (!existing) return json({ error: "用户名或密码错误" }, 401);
          const { hash } = await hashPassword(password, existing.salt);
          if (hash !== existing.hash) return json({ error: "用户名或密码错误" }, 401);
          return json({ token: await makeToken(u, SECRET), username: u });
        }
      }

      // ---- 进度数据（需登录）----
      if (path === "/data" && (request.method === "GET" || request.method === "PUT")) {
        const auth = request.headers.get("Authorization") || "";
        const payload = await readToken(auth.replace(/^Bearer\s+/i, ""), SECRET);
        if (!payload) return json({ error: "未登录或登录已过期" }, 401);
        const dataKey = "data:" + payload.u;

        if (request.method === "GET") {
          const stored = await env.VOCAB_KV.get(dataKey, "json");
          return json({ data: stored ? stored.data : null, updatedAt: stored ? stored.updatedAt : 0 });
        } else {
          const body = await request.json().catch(() => ({}));
          if (body.data == null) return json({ error: "缺少 data" }, 400);
          const updatedAt = Date.now();
          await env.VOCAB_KV.put(dataKey, JSON.stringify({ data: body.data, updatedAt }));
          return json({ ok: true, updatedAt });
        }
      }

      if (path === "" || path === "/") return json({ ok: true, service: "vocab-api" });
      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: "server error: " + (e && e.message) }, 500);
    }
  }
};
