import { defineAction } from "astro:actions";
import { z } from "astro:schema";

const API_ENDPOINT = "https://api.weatherapi.com/v1";
const API_KEY = "e4b597ab473f4097a5c44932250905";

export const server = {
  searchLocation: defineAction({
    input: z.string(),
    handler: async (input) => {
      if (!input) return null;
      try {
        const response = await fetch(
          `${API_ENDPOINT}/search.json?q=${input}&key=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
      }
    },
  }),
  getWeather: defineAction({
    input: z.string(),
    // By ID returned from Search API. e.g: q=id:2801268
    handler: async (input) => {
      try {
        const response = await fetch(
          `${API_ENDPOINT}/current.json?q=${input}&key=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
      }
    },
  }),
};
