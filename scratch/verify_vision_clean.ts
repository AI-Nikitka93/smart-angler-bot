import { analyzeCatch } from "../src/services/ai_vision.js";

async function run() {
  console.log("Fetching test image...");
  // Using a generic reliable image source
  const response = await fetch("https://picsum.photos/200/300");
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  console.log("Analyzing with refactored local ai_vision.ts...");
  const result = await analyzeCatch(buffer, "image/jpeg");
  console.log("✅ analyzeCatch Result:", result);
}

run();
