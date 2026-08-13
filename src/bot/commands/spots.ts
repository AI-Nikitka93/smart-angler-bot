import { Telegraf } from "telegraf";
import { db } from "../../db/index.js";
import { spots, users } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export function setupSpotsCommand(bot: Telegraf) {
  bot.command("addspot", async (ctx) => {
    const text = ctx.message.text;
    const args = text.split(" ").slice(1);
    
    if (args.length < 2) {
      return ctx.reply("Использование: /addspot <широта> <долгота> [название]");
    }
    
    const lat = parseFloat(args[0]);
    const lon = parseFloat(args[1]);
    const name = args.slice(2).join(" ") || "Новая точка";
    
    if (isNaN(lat) || isNaN(lon)) {
      return ctx.reply("Неверные координаты. Пожалуйста, проверьте формат.");
    }
    
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
      
      await db.insert(spots).values({
        userId: user.id,
        lat,
        lon,
        name,
      });
      
      return ctx.reply(`Рыбное место "${name}" успешно добавлено на координатах ${lat}, ${lon}! 🎣`);
    } catch (error) {
      console.error(error);
      return ctx.reply("Не удалось сохранить точку. Попробуйте еще раз.");
    }
  });
}
