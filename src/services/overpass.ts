export type WaterBodyType = "river" | "lake" | "reservoir" | "unknown";

export interface WaterBody {
  name: string;
  type: WaterBodyType;
  distance: number; // approximate
}

export async function detectWaterBody(lat: number, lon: number): Promise<WaterBody> {
  const query = `
    [out:json][timeout:10];
    (
      way["natural"="water"](around:2000,${lat},${lon});
      way["waterway"="river"](around:2000,${lat},${lon});
      way["water"="reservoir"](around:2000,${lat},${lon});
      relation["natural"="water"](around:2000,${lat},${lon});
      relation["waterway"="river"](around:2000,${lat},${lon});
      relation["water"="reservoir"](around:2000,${lat},${lon});
    );
    out tags center;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "data=" + encodeURIComponent(query)
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json() as any;
    
    if (data.elements && data.elements.length > 0) {
      // Find the closest or first named one
      for (const el of data.elements) {
        const tags = el.tags || {};
        let type: WaterBodyType = "unknown";
        
        if (tags.waterway === "river") type = "river";
        else if (tags.water === "reservoir") type = "reservoir";
        else if (tags.natural === "water") type = "lake";
        
        const name = tags["name:ru"] || tags.name || "Неизвестный водоем";
        
        return {
          name,
          type,
          distance: 0 // Distance calculation is omitted for brevity, returning 0
        };
      }
    }

    return { name: "Неизвестный водоем", type: "unknown", distance: 0 };
  } catch (error) {
    console.error("Failed to detect water body:", error);
    return { name: "Неизвестный водоем", type: "unknown", distance: 0 };
  }
}
