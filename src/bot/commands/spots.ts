import { Telegraf, Markup } from "telegraf";
import { db } from "../../db/index.js";
import { spots, users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { detectWaterBody } from "../../services/overpass.js";

export function setupSpotsCommand(bot: Telegraf) {
  
  // Handle the callback from the inline keyboard
  bot.action(/^addspot_(.+)_(.+)$/, async (ctx) => {
    await ctx.answerCbQuery(); // Acknowledge button click
    
    const lat = parseFloat(ctx.match[1]);
    const lon = parseFloat(ctx.match[2]);
    
    if (isNaN(lat) || isNaN(lon)) {
      return ctx.editMessageText("Неверные координаты.");
    }
    
    // We send a ForceReply message containing the coordinates in the text so we can parse it later
    return ctx.reply(
      `Введите название для нового места\n(Координаты: ${lat}, ${lon}):`,
      Markup.forceReply()
    );
  });
  
  // Handle the user's text reply containing the name
  bot.on("text", async (ctx, next) => {
    // Check if it's a reply to our ForceReply message
    const replyTo = ctx.message.reply_to_message;
    if (replyTo && 'text' in replyTo && replyTo.text.includes("Введите название для нового места\n(Координаты:")) {
      
      const match = replyTo.text.match(/Координаты: ([\d.-]+), ([\d.-]+)/);
      if (!match) return next();
      
      const lat = parseFloat(match[1]);
      const lon = parseFloat(match[2]);
      const name = ctx.message.text;
      
      try {
        const telegramId = ctx.from.id.toString();
        let user = await db.query.users.findFirst({
          where: eq(users.telegramId, telegramId)
        });
        
        if (!user) {
          const [newUser] = await db.insert(users).values({
            telegramId,
            username: ctx.from.username,
          }).returning();
          user = newUser;
        }
        
        const msg = await ctx.reply("⏳ Анализирую водоем...");
        const waterBody = await detectWaterBody(lat, lon);
        
        await db.insert(spots).values({
          userId: user.id,
          lat,
          lon,
          name,
          waterType: waterBody.type,
          waterName: waterBody.name
        });
        
        return ctx.telegram.editMessageText(
          ctx.chat.id, 
          msg.message_id, 
          undefined, 
          `✅ Рыбное место "${name}" успешно добавлено!\n💧 Определен водоем: ${waterBody.name || 'Неизвестно'} (${waterBody.type}).`
        );
      } catch (error) {
        console.error("Error saving spot:", error);
        return ctx.reply("Не удалось сохранить точку. Попробуйте еще раз.");
      }
    }
    
    return next();
  });
}
