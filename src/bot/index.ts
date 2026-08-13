import { Telegraf } from "telegraf";
import { env } from "../utils/env.js";

export const bot = new Telegraf(env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Welcome to Smart Angler 2026! 🎣");
});

bot.help((ctx) => {
  ctx.reply("Send me a photo of a fish or your location.");
});

// Add more scenes and commands here
