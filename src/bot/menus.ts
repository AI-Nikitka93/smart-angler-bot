import { Markup } from "telegraf";

export const mainMenu = Markup.keyboard([
  ["🌤 Узнать погоду", "🎣 Добавить место"],
  ["📸 Распознать фото", "❓ Помощь"],
]).resize();

export const cancelMenu = Markup.keyboard([
  ["🔙 Отмена"]
]).resize();

export const locationRequestMenu = Markup.keyboard([
  [Markup.button.locationRequest("📍 Отправить текущую геопозицию")],
  ["🔙 Отмена"]
]).resize().oneTime();
