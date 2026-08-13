import { Telegraf } from "telegraf";
import { getSolunarForecast } from "../../services/solunar.js";
import { detectWaterBody } from "../../services/overpass.js";

export function setupWeatherCommand(bot: Telegraf) {
  bot.action(/^weather_(.+)_(.+)$/, async (ctx) => {
    // Acknowledge the callback to stop the loading spinner on the button
    await ctx.answerCbQuery("Загружаю прогноз погоды...");
    
    const lat = parseFloat(ctx.match[1]);
    const lon = parseFloat(ctx.match[2]);
    
    if (isNaN(lat) || isNaN(lon)) {
      return ctx.editMessageText("Неверные координаты. Пожалуйста, попробуйте еще раз.");
    }
    
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(url);
      const data = await res.json() as any;
      
      if (!data.current_weather) {
        return ctx.editMessageText("Не удалось получить данные о погоде для этой локации.");
      }
      
      const { temperature, windspeed } = data.current_weather;
      
      const waterBody = await detectWaterBody(lat, lon);
      const forecast = getSolunarForecast(lat, lon, new Date(), "Общая", waterBody.type);
      
      const waterBodyText = waterBody.name ? `${waterBody.type} ${waterBody.name}` : "Неизвестный водоем";
      
      return ctx.editMessageText(
        `🌍 Точка: ${lat.toFixed(4)}, ${lon.toFixed(4)}\n` +
        `💧 Водоем: ${waterBodyText}\n\n` +
        `🌤 Текущая погода:\nТемпература: ${temperature}°C\nСкорость ветра: ${windspeed} км/ч\n\n` +
        `🌑 Фаза луны: ${forecast.moonPhase} (${Math.round(forecast.fraction * 100)}%)\n` +
        `🎣 Вероятность клева: ${forecast.probability}%\n`
      );
    } catch (error) {
      console.error(error);
      return ctx.editMessageText("Не удалось получить погоду.");
    }
  });
}
