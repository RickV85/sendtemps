import { OpenAIForecastData } from "../Classes/OpenAIForecastData";

export async function postForecastForSendScores(
  aiForecastData: OpenAIForecastData
) {
  try {
    const response = await fetch("/api/open_ai/send_score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aiForecastData),
      credentials: "include",
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(`Error response postNewUserLocation: ${errorData}`);
    }
  } catch (error) {
    throw error;
  }
}
