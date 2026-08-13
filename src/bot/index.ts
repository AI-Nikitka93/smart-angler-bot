import { Telegraf } from "telegraf";
import { env } from "../utils/env.js";
import { setupSpotsCommand } from "./commands/spots.js";
import { setupWeatherCommand } from "./commands/weather.js";
import { setupPhotoHandler } from "./commands/photo_handler.js";

export const bot = new Telegraf(env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Welcome to Smart Angler 2026! 🎣");
});

bot.help((ctx) => {
  ctx.reply("Send me a photo of a fish or your location.");
});

// Register commands
setupSpotsCommand(bot);
setupWeatherCommand(bot);
setupPhotoHandler(bot);
