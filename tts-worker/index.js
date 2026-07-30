// Cloudflare Worker：服务端代理 Google 翻译 TTS，返回 MP3
// 浏览器 → 本 Worker → Google（服务端无 Referer 限制），从而在网页里也能读整句。
// 用法: GET /?text=hello&tl=en
// 说明：免费、无需登录/密钥。微软 Edge 神经语音接口已对本方案 403（2026 年反滥用升级），故改用 Google。

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// 按空格把文本切成不超过 maxLen 的片段（Google TTS 单次约 200 字符上限）
function splitText(text, maxLen) {
  const words = text.split(/\s+/);
  const parts = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxLen) {
      if (cur) parts.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) parts.push(cur.trim());
  return parts.length ? parts : [text];
}

async function fetchTTS(chunk, tl) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(chunk)}`;
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA, "Referer": "https://translate.google.com/" } });
      if (!r.ok) throw new Error("google " + r.status);
      const buf = new Uint8Array(await r.arrayBuffer());
      if (!buf.length) throw new Error("empty");
      return buf;
    } catch (e) {
      lastErr = e;
      await new Promise(res => setTimeout(res, 150 * (attempt + 1)));
    }
  }
  throw lastErr;
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    const text = (url.searchParams.get("text") || "").slice(0, 600).trim();
    const tl = url.searchParams.get("tl") || "en";
    if (!text) return new Response("missing text", { status: 400, headers: CORS });

    try {
      const chunks = splitText(text, 190);
      const audios = [];
      for (const c of chunks) audios.push(await fetchTTS(c, tl));
      let total = 0;
      for (const a of audios) total += a.length;
      const out = new Uint8Array(total);
      let off = 0;
      for (const a of audios) { out.set(a, off); off += a.length; }
      return new Response(out, {
        headers: { ...CORS, "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=604800" }
      });
    } catch (e) {
      return new Response("tts error: " + (e && e.message), { status: 502, headers: CORS });
    }
  }
};
