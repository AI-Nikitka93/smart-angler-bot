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
  
  const modelsToTest = [
    "Qwen/Qwen2-VL-7B-Instruct",
    "Salesforce/blip-image-captioning-large",
    "microsoft/trocr-base-printed"
  ];

  for (const model of modelsToTest) {
    console.log(`\nTesting model: ${model}`);
    try {
      if (model.includes("blip") || model.includes("trocr")) {
        const result = await hf.imageToText({
          model: model,
          data: buffer,
        });
        console.log(`✅ Success with ${model}:`, result);
        return; // Success, stop testing
      } else {
         const result = await hf.chatCompletion({
            model: model,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "Что за рыба на фото?" },
                  { type: "image_url", image_url: { url: `data:image/jpeg;base64,${buffer.toString("base64")}` } }
                ]
              }
            ],
            max_tokens: 100,
          });
          console.log(`✅ Success with ${model}:`, result.choices[0].message);
          return; // Success, stop testing
      }
    } catch (error: any) {
      console.error(`❌ API Error for ${model}:`, error.message || error);
    }
  }
}

run();
