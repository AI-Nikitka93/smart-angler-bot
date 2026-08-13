import { pipeline } from "@xenova/transformers";

async function run() {
  console.log("Loading local AI vision model...");
  try {
    const classifier = await pipeline("image-classification", "Xenova/vit-base-patch16-224");
    
    console.log("Fetching a sample fish image...");
    const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Esox_lucius1.jpg/800px-Esox_lucius1.jpg";
    
    console.log("Analyzing image locally...");
    const results = await classifier(imageUrl);
    console.log("✅ Analysis Result:", results);
  } catch (error: any) {
    console.error("❌ Local AI Error:", error.message || error);
  }
}

run();
