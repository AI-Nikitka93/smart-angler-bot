import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const VERCEL_URL = process.env.VERCEL_URL;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");
if (!VERCEL_URL) throw new Error("VERCEL_URL is missing. Please set your Vercel project URL.");

const bot = new Telegraf(BOT_TOKEN);
const webhookUrl = `${VERCEL_URL}/api/webhook`;

bot.telegram.setWebhook(webhookUrl)
  .then(() => {
    console.log(`✅ Webhook successfully set to ${webhookUrl}`);
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Failed to set webhook:", e);
    process.exit(1);
  });
