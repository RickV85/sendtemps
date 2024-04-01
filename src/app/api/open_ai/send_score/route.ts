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
          "Optimal conditions for most climbers would be between 50 and 75 degrees, clear skies and low wind. Snow and rain are extremely undesirable, making it impossible to rock climb. Snowfall within a few days prior or heavy rain the day prior could leave the rock wet if not sunny and breezy.";
        break;
      case "mtb":
        sportString = "mountain biking";
        sportPrompt =
          "Optimal conditions for most mountain bikers is between 50 and 85 degrees. If it is colder, sunny skies and low wind makes it more favorable. If the temperature is above 85, cloudy skies and a light breeze are desirable";
        break;
      case "ski":
        sportString = "skiing";
        sportPrompt =
          "Optimal conditions for most skiers is between 15 and 45 degrees with little wind and sunny skies. Factors that make the day more desirable include new snowfall forecasted the night or day before the day the user would engage in skiing. High wind and low wind chill values are the least desirable conditions for skiing, especially if it is also cloudy. Ski conditions are better the day after snow is forecasted as skiing while it is snowing can be cold and hard to see. Rain and freezing rain are very unfavorable conditions for skiing.";
    }

    const aiPrompt = `Your job is to create "sendScore" value between 0 and 10 that represents how favorable it is for the user to participate in ${sportString} based on the below information and return a JSON response. The days are represented by objects in the "forecastPeriods" array. Any period that is a "Night" should be scored with a lower "sendScore" as all sports are less favorable to engage in at night. Only return a JSON response with this structure:
    {
      "forecastPeriods" : [
      {"name" : same as name for each period, "sendScore": number representing how favorable that period is to engage in the "sport" provided} ... return a response object for each period
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
      temperature: 0.5,
      max_tokens: 448,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (aiResponse?.choices[0]?.message?.content) {
      return NextResponse.json(aiResponse?.choices[0]?.message?.content, {
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
