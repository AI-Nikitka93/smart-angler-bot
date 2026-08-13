import { HfInference } from "@huggingface/inference";
import { env } from "../utils/env.js";

const hf = new HfInference(env.HF_TOKEN);

export async function analyzeCatch(imageBuffer: Buffer, mimeType: string) {
  const base64Image = imageBuffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  const response = await hf.chatCompletion({
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this image of a fish. Return ONLY a valid JSON object with three keys: 'fishType' (string), 'weightEstimate' (number, in kg), 'description' (string). Do not return markdown, just the JSON string." },
          { type: "image_url", image_url: { url: dataUrl } }
        ]
      }
    ],
    max_tokens: 500,
  });

  const content = response.choices[0].message.content || "{}";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return JSON.parse(content);
}
