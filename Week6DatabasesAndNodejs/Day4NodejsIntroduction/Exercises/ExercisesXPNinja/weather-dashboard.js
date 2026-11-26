import chalk from "chalk";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import { cityWeather } from "./weather.js";

export async function askCity(input = stdin, output = stdout) {
  const lines = createInterface({ input, crlfDelay: Infinity });
  try {
    output.write("City: ");
    for await (const line of lines) {
      if (line.trim()) return line.trim();
      output.write("Enter a city name: ");
    }
    throw new Error("No city supplied.");
  } finally {
    lines.close();
  }
}

export function formatWeather(report) {
  return [
    chalk.bold(report.location),
    `Local time: ${report.time} (${report.zone})`,
    `Temperature: ${report.temperature} °C`,
    `Wind: ${report.wind} km/h`,
    "Weather data: Open-Meteo (https://open-meteo.com/)",
  ].join("\n");
}

export async function weatherDashboard(city) {
  const query = city === undefined ? await askCity() : city;
  console.log(formatWeather(await cityWeather(query)));
}
