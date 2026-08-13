import { analyzeCatch } from "../src/services/ai_vision.js";

async function run() {
  console.log("Fetching test image...");
  const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Esox_lucius1.jpg/800px-Esox_lucius1.jpg";
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  console.log("Analyzing with refactored ai_vision.ts...");
  const result = await analyzeCatch(buffer, "image/jpeg");
  console.log("✅ analyzeCatch Result:", result);
}

run();
