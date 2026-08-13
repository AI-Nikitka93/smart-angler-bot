import { bot } from "./index.js";

console.log("Starting Smart Angler 2026 locally in polling mode...");
bot.launch().then(() => {
  console.log("🎣 Bot is up and running!");
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
