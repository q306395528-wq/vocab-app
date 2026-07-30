# vocab-tts Worker

Cloudflare Worker：服务端代理 Google 翻译 TTS，返回 MP3，供背单词 app 在网页里读整句。

## 部署
```
cd tts-worker && wrangler deploy
```
线上地址：https://vocab-tts.q306395528.workers.dev/?text=hello

> 说明：微软 Edge 神经语音接口已对本方案返回 403（反滥用升级），故改用 Google TTS 代理。
