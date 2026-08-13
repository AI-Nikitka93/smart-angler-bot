import { bot } from "../src/bot/index.js";

// Vercel Serverless Function entry point
export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      await bot.handleUpdate(req.body);
      res.status(200).json({ status: "ok" });
    } else {
      res.status(200).json({ status: "Smart Angler 2026 Bot is running." });
    }
  } catch (error) {
    console.error("❌ Global Error in Webhook Handler:", error);
    // Vercel expects a 500 status on internal crash to avoid silent failures
    res.status(500).json({ error: "Internal Server Error" });
  }
}
