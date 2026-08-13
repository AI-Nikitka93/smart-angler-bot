import { Telegraf } from "telegraf";
import { getSolunarForecast } from "../../services/solunar.js";

export function setupWeatherCommand(bot: Telegraf) {
  bot.command("weather", async (ctx) => {
    const text = ctx.message.text;
    const args = text.split(" ").slice(1);
    
    if (args.length < 2) {
      return ctx.reply("Использование: /weather <широта> <долгота>");
    }
    
    const lat = parseFloat(args[0]);
    const lon = parseFloat(args[1]);
    
    if (isNaN(lat) || isNaN(lon)) {
      return ctx.reply("Неверные координаты. Пожалуйста, проверьте формат.");
    }
    
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(url);
      const data = await res.json() as any;
      
      if (!data.current_weather) {
        return ctx.reply("Не удалось получить данные о погоде для этой локации.");
      }
      
      const { temperature, windspeed } = data.current_weather;
      
      const forecast = getSolunarForecast(lat, lon, new Date(), "Общая");
      
      return ctx.reply(
        `🌤 Текущая погода:\nТемпература: ${temperature}°C\nСкорость ветра: ${windspeed} км/ч\n\n` +
        `🌑 Фаза луны: ${forecast.moonPhase} (${forecast.fraction}%)\n` +
        `🎣 Вероятность клева: ${forecast.probability}%\n`
      );
    } catch (error) {
      console.error(error);
      return ctx.reply("Не удалось получить погоду.");
    }
  });
}
