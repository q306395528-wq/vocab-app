# vocab-api Worker

墨记单词后端 API：账号登录 + 学习进度云同步（Cloudflare Worker + KV）。

## 部署
```
cd api-worker && wrangler deploy
```
需先创建 KV 并在 wrangler.toml 填入 id，并设置密钥：
```
wrangler kv namespace create VOCAB_KV
echo "<随机64位十六进制>" | wrangler secret put JWT_SECRET
```
线上：https://vocab-api.q306395528.workers.dev

## 端点
- POST /register {username,password} → {token,username}
- POST /login {username,password} → {token,username}
- GET  /data  (Bearer token) → {data,updatedAt}
- PUT  /data  (Bearer token) {data} → {ok,updatedAt}

密码 PBKDF2-SHA256 加盐哈希存储，绝不明文；token 为 HMAC 签名，7 天有效。
