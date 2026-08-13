import { Telegraf } from "telegraf";
import { analyzeCatch } from "../../services/ai_vision.js";

export function setupPhotoHandler(bot: Telegraf) {
  bot.on("photo", async (ctx) => {
    try {
      const msg = await ctx.reply("Analyzing your catch with AI...");
      
      const photo = ctx.message.photo.pop();
      if (!photo) return;
      
      const fileLink = await ctx.telegram.getFileLink(photo.file_id);
      const response = await fetch(fileLink.toString());
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const result = await analyzeCatch(buffer, "image/jpeg");
      
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        msg.message_id,
        undefined,
        `🎣 **Catch Analysis**\n\n🐟 Species: ${result.fishType}\n⚖️ Estimated Weight: ${result.weightEstimate}kg\n📝 ${result.description}`,
        { parse_mode: "Markdown" }
      );
    } catch (e) {
      console.error(e);
      await ctx.reply("Failed to analyze the photo. Please try again.");
    }
  });
}
