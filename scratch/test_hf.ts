import { analyzeCatch } from "../src/services/ai_vision.js";

async function run() {
  console.log("Fetching a sample fish image...");
  // A picture of a Pike (Щука)
  const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Esox_lucius1.jpg/800px-Esox_lucius1.jpg";
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  console.log("Sending to Hugging Face Vision API...");
  try {
    const result = await analyzeCatch(buffer, "image/jpeg");
    console.log("✅ Analysis Result:", result);
  } catch (error: any) {
    console.error("❌ API Error:", error.message || error);
  }
}

run();
