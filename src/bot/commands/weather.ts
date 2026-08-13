import { Telegraf } from "telegraf";

export function setupWeatherCommand(bot: Telegraf) {
  bot.command("weather", async (ctx) => {
    const text = ctx.message.text;
    const args = text.split(" ").slice(1);
    
    if (args.length < 2) {
      return ctx.reply("Usage: /weather <lat> <lon>");
    }
    
    const lat = parseFloat(args[0]);
    const lon = parseFloat(args[1]);
    
    if (isNaN(lat) || isNaN(lon)) {
      return ctx.reply("Invalid coordinates.");
    }
    
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(url);
      const data = await res.json() as any;
      
      if (!data.current_weather) {
        return ctx.reply("Could not fetch weather data for this location.");
      }
      
      const { temperature, windspeed } = data.current_weather;
      return ctx.reply(`🌤 Current weather:\nTemperature: ${temperature}°C\nWind speed: ${windspeed} km/h`);
    } catch (error) {
      console.error(error);
      return ctx.reply("Failed to get weather.");
    }
  });
}
