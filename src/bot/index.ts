import { Telegraf, Markup } from "telegraf";
import { env } from "../utils/env.js";
import { setupSpotsCommand } from "./commands/spots.js";
import { setupWeatherCommand } from "./commands/weather.js";
import { setupPhotoHandler } from "./commands/photo_handler.js";
import { mainMenu, locationRequestMenu } from "./menus.js";

export const bot = new Telegraf(env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Добро пожаловать в Умный Рыболов 2026! 🎣\nВыберите действие в меню ниже:", mainMenu);
});

bot.help((ctx) => {
  ctx.reply("Отправьте мне фото рыбы или выберите действие в меню.", mainMenu);
});

// Handling ReplyKeyboard buttons
bot.hears("🌤 Узнать погоду", (ctx) => {
  ctx.reply("Для прогноза нужна ваша геолокация. Нажмите кнопку ниже:", locationRequestMenu);
});

bot.hears("🎣 Добавить место", (ctx) => {
  ctx.reply("Чтобы сохранить новое рыбное место, отправьте вашу геопозицию:", locationRequestMenu);
});

bot.hears("📸 Распознать фото", (ctx) => {
  ctx.reply("Просто отправьте мне фотографию вашего улова, и наша локальная нейросеть определит вид и вес рыбы!", mainMenu);
});

bot.hears("❓ Помощь", (ctx) => {
  ctx.reply("Бот помогает анализировать фото рыбы, сохранять рыбные места и узнавать точный солунарный прогноз.\nВсе функции доступны через меню внизу.", mainMenu);
});

bot.hears("🔙 Отмена", (ctx) => {
  ctx.reply("Возвращаю в главное меню", mainMenu);
});

// Intercepting location uploads natively
bot.on("location", (ctx) => {
  const { latitude, longitude } = ctx.message.location;
  
  ctx.reply("Локация получена! Что вы хотите сделать с этой точкой?", Markup.inlineKeyboard([
    [Markup.button.callback("🌤 Узнать прогноз клева", `weather_${latitude}_${longitude}`)],
    [Markup.button.callback("🎣 Сохранить место", `addspot_${latitude}_${longitude}`)]
  ]));
});

// Register action/command handlers
setupSpotsCommand(bot);
setupWeatherCommand(bot);
setupPhotoHandler(bot);
