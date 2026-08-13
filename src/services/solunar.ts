import * as SunCalc from "suncalc";

export function getSolunarForecast(lat: number, lon: number, date: Date = new Date()) {
  const moonIllumination = SunCalc.getMoonIllumination(date);
  const sunTimes = SunCalc.getTimes(date, lat, lon);
  
  // Phase logic: 0 = New Moon, 0.5 = Full Moon
  let phaseName = "New Moon";
  if (moonIllumination.phase > 0.03 && moonIllumination.phase < 0.47) phaseName = "Waxing";
  if (moonIllumination.phase >= 0.47 && moonIllumination.phase <= 0.53) phaseName = "Full Moon";
  if (moonIllumination.phase > 0.53 && moonIllumination.phase < 0.97) phaseName = "Waning";
  
  // Basic forecast logic based on moon phase
  let rating = 3; // 1 to 5
  if (phaseName === "Full Moon" || phaseName === "New Moon") {
    rating = 5;
  }
  
  return {
    moonPhase: phaseName,
    fraction: moonIllumination.fraction,
    rating,
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset
  };
}
