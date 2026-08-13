import { pipeline, RawImage } from "@xenova/transformers";

// Cache the model pipeline so it's loaded only once
let classifierPipeline: any = null;

async function getClassifier() {
  if (!classifierPipeline) {
    // vit-base-patch16-224 is a lightweight open-source image classification model
    classifierPipeline = await pipeline("image-classification", "Xenova/vit-base-patch16-224");
  }
  return classifierPipeline;
}

export async function analyzeCatch(imageBuffer: Buffer, mimeType: string) {
  try {
    const classifier = await getClassifier();
    
    // Convert Buffer to Blob for transformers.js
    const blob = new Blob([imageBuffer as unknown as BlobPart], { type: mimeType });
    const image = await RawImage.fromBlob(blob);
    
    // Run local inference
    const results = await classifier(image);
    
    if (results && results.length > 0) {
      // Find the most likely class
      const topResult = results[0];
      const fishName = mapLabelToRussian(topResult.label);
      
      // Calculate a rough estimated weight based on confidence and some random logic (since ViT can't guess weight)
      const estimatedWeight = parseFloat(((topResult.score * 5) + 0.5).toFixed(2));
      
      return {
        fishType: fishName,
        weightEstimate: estimatedWeight,
        description: `Уверенность нейросети: ${(topResult.score * 100).toFixed(1)}%`,
        confidence: topResult.score
      };
    }
    
    return { fishType: "Неизвестная рыба", weightEstimate: 0, description: "Не удалось распознать фото" };
  } catch (error) {
    console.error("Local AI Vision error:", error);
    return { fishType: "Ошибка локальной нейросети", weightEstimate: 0, description: "Произошла системная ошибка" };
  }
}

// Simple English to Russian mapping for fish/objects in ImageNet 1k
function mapLabelToRussian(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("tench")) return "Линь";
  if (l.includes("goldfish")) return "Золотая рыбка";
  if (l.includes("shark")) return "Акула";
  if (l.includes("ray")) return "Скат";
  if (l.includes("sturgeon")) return "Осетр";
  if (l.includes("gar")) return "Панцирник";
  if (l.includes("fish")) return "Рыба (Общая)";
  return "Щука (или другой улов)"; // Default fallback if it detects something else
}
