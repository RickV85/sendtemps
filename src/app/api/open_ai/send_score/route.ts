import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    let sportString = "";
    let sportPrompt = "";

    switch (reqBody.sport) {
      case "climb":
        sportString = "rock climbing";
        sportPrompt =
          "Optimal rock climbing conditions are 50-75°F with sunny skies and and wind under 15mph. Wind gusts above 30mph are unfavorable and above 50mph should be avoided. Snow and rain are extremely undesirable, making it impossible to rock climb. Snowfall within a few days prior or heavy rain the day prior could leave the rock wet if not sunny and breezy.";
        break;
      case "mtb":
        sportString = "mountain biking";
        sportPrompt =
          "Optimal mountain biking conditions are 50-85°F with sunny skies and wind under 15mph. Below 50°F, sunny and calm conditions are preferable. Above 85°F, seek cloudy skies with a light breeze (up to 15mph). Adjust sendScore for wind speeds above 15mph, visibility issues, and trail conditions from recent heavy rain or snow.";
        break;
      case "ski":
        sportString = "skiing";
        sportPrompt =
          "Optimal skiing conditions are 15-45°F with sunny skies and wind speed under 20mph. New snowfall forecasted the night or day before, or on the day the user would engage in skiing is highly desirable. Snowfall amounts above 2 inches are most desireable and increases exponentially with higher snowfall forecasts. High wind and/or low wind chill values are the least desirable conditions for skiing, especially if it is also cloudy. Rain and freezing rain are very unfavorable conditions for skiing.";
    }

    const aiPrompt = `Your task is to compute a "sendScore" between 1 and 10 for each forecast period and a text summary, reflecting the suitability for ${sportString}. Each day and night's forecast is represented by an object in the "forecastPeriods" array. All temperatures are in degrees Fahrenheit and winds in MPH. Night forecast periods are less desireable to participate in ${sportString} and should be scored significantly lower. Only return a JSON response with this structure:
    {
      "summary": "A brief summary indicating the best day, and also the next best options, for ${sportString} at the user's selected location based on the forecast periods. Do not reference sendScore values. It should be 1 to 3 sentences. Do not say to avoid nights.",
      "forecastPeriods": [
        {"name": "The same name as each period", "sendScore": "A score representing the suitability of that period for ${sportString}"}
        ...
      ]
    }
    ${sportPrompt}`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: JSON.stringify(aiPrompt),
        },
        {
          role: "user",
          content: JSON.stringify(reqBody.forecastPeriods),
        },
      ],
      temperature: 0.75,
      max_tokens: 448,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: { type: "json_object" },
    });

    if (aiResponse?.choices[0]?.message?.content) {
      const content = JSON.parse(aiResponse.choices[0].message.content);
      return NextResponse.json(content, {
        status: 200,
      });
    } else {
      throw new Error("OpenAI response undefined");
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
