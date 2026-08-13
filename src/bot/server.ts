import { bot } from "./index.js";
import http from "http";

const PORT = process.env.PORT || 3000;

// Create a simple HTTP server to satisfy Render's Web Service port binding requirement
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Smart Angler Bot 2026 is running!");
});

server.listen(PORT, () => {
  console.log(`🌐 Healthcheck server listening on port ${PORT}`);
});

console.log("Starting Smart Angler 2026 locally in polling mode...");
bot.launch().then(() => {
  console.log("🎣 Bot is up and running!");
});

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  server.close();
});
process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  server.close();
});
