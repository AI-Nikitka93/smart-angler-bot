import { Telegraf, Markup } from "telegraf";
import { analyzeCatch } from "../../services/ai_vision.js";

export function setupPhotoHandler(bot: Telegraf) {
  bot.on("photo", async (ctx) => {
    try {
      const msg = await ctx.reply("Анализирую ваш улов с помощью нейросети...");
      
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
        `🎣 **Анализ улова**\n\n🐟 Вид рыбы: ${result.fishType}\n⚖️ Примерный вес: ${result.weightEstimate} кг\n📝 ${result.description}`,
        { 
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [Markup.button.callback("❌ Закрыть", "close_photo")]
          ])
        }
      );
    } catch (e) {
      console.error(e);
      await ctx.reply("Не удалось проанализировать фото. Пожалуйста, попробуйте еще раз.");
    }
  });

  bot.action("close_photo", async (ctx) => {
    await ctx.deleteMessage();
  });
}
