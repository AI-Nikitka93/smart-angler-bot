import { z } from "zod";

const openMeteoResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  elevation: z.number(),
  current_weather: z.object({
    temperature: z.number(),
    windspeed: z.number(),
    winddirection: z.number(),
    weathercode: z.number(),
    is_day: z.union([z.number(), z.boolean()]).optional(),
    time: z.string()
  })
});

export type WeatherResult = z.infer<typeof openMeteoResponseSchema>["current_weather"];

/**
 * Fetches current weather for a specific latitude and longitude spot using open-meteo API.
 * @param lat Latitude of the spot
 * @param lon Longitude of the spot
 * @returns Typed result with temperature, wind, etc.
 */
export async function getWeatherForSpot(lat: number, lon: number): Promise<WeatherResult> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch weather: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const parsedData = openMeteoResponseSchema.parse(data);

  return parsedData.current_weather;
}
