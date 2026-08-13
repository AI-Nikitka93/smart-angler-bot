import { analyzeCatch } from "../src/services/ai_vision.js";

async function run() {
  console.log("Using a 1x1 pixel valid base64 JPEG...");
  // 1x1 white pixel JPEG
  const base64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
  const buffer = Buffer.from(base64, "base64");
  
  console.log("Analyzing with refactored local ai_vision.ts...");
  const result = await analyzeCatch(buffer, "image/jpeg");
  console.log("✅ analyzeCatch Result:", result);
}

run();
