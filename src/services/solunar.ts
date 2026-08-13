import * as SunCalc from "suncalc";

type FishType = "Щука" | "Карп" | "Лещ" | "Судак" | "Общая";

export function getSolunarForecast(lat: number, lon: number, date: Date = new Date(), fish: FishType = "Общая", waterType: string = "unknown") {
  const moonIllumination = SunCalc.getMoonIllumination(date);
  const sunTimes = SunCalc.getTimes(date, lat, lon);
  
  // Moon phases
  const phase = moonIllumination.phase;
  let phaseName = "Новолуние";
  if (phase > 0.03 && phase < 0.25) phaseName = "Растущий полумесяц";
  else if (phase >= 0.25 && phase < 0.47) phaseName = "Первая четверть";
  else if (phase >= 0.47 && phase <= 0.53) phaseName = "Полнолуние";
  else if (phase > 0.53 && phase < 0.75) phaseName = "Убывающая луна";
  else if (phase >= 0.75 && phase <= 0.97) phaseName = "Последняя четверть";
  else if (phase > 0.97) phaseName = "Новолуние";
  
  // Calculate Base Biting Probability (0 to 100) based on fish type
  let biteProbability = 50;
  
  switch (fish) {
    case "Щука":
      // Pike prefers New Moon and First Quarter
      if (phaseName === "Новолуние" || phaseName === "Первая четверть") biteProbability += 30;
      else if (phaseName === "Полнолуние") biteProbability -= 20;
      break;
    case "Карп":
      // Carp prefers Waxing and Full Moon
      if (phaseName === "Первая четверть" || phaseName === "Полнолуние") biteProbability += 35;
      else if (phaseName === "Новолуние") biteProbability -= 15;
      break;
    case "Лещ":
      // Bream loves Full Moon
      if (phaseName === "Полнолуние") biteProbability += 40;
      else if (phaseName === "Последняя четверть") biteProbability -= 10;
      break;
    case "Судак":
      // Zander prefers New Moon and First Quarter
      if (phaseName === "Новолуние" || phaseName === "Растущий полумесяц") biteProbability += 30;
      else if (phaseName === "Полнолуние") biteProbability -= 25;
      break;
    default:
      // General fishing: Peaks at full and new moon
      if (phaseName === "Полнолуние" || phaseName === "Новолуние") biteProbability += 20;
      break;
  }
  
  // Adjust based on water body type
  if (waterType === "river") {
    // Rivers have currents, oxygen is better, fish are more active
    biteProbability += 10;
  } else if (waterType === "lake" || waterType === "reservoir") {
    // Lakes and reservoirs are more sensitive to moon phase and stagnation
    biteProbability -= 5;
  }
  
  // Ensure probability stays within 0-100%
  biteProbability = Math.max(0, Math.min(100, biteProbability));

  return {
    moonPhase: phaseName,
    fraction: Math.round(moonIllumination.fraction * 100),
    probability: biteProbability,
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset
  };
}
