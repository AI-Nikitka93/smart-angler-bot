import { HfInference } from "@huggingface/inference";
import * as dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN);

async function run() {
  console.log("Fetching a sample fish image...");
  const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Esox_lucius1.jpg/800px-Esox_lucius1.jpg";
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const model = "google/vit-base-patch16-224";

  console.log(`\nTesting model: ${model}`);
  try {
    const result = await hf.imageClassification({
      model: model,
      data: buffer,
    });
    console.log(`✅ Success with ${model}:`, result);
  } catch (error: any) {
    console.error(`❌ API Error for ${model}:`, error.message || error);
  }
}

run();
