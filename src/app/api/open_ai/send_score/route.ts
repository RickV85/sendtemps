import { authOptions } from '@/app/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VALID_SPORTS = ['climb', 'mtb', 'ski'] as const;
type Sport = (typeof VALID_SPORTS)[number];

function isValidSport(value: unknown): value is Sport {
  return VALID_SPORTS.includes(value as Sport);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reqBody = await request.json();

    if (!isValidSport(reqBody.sport)) {
      return NextResponse.json(
        { error: `Invalid sport. Must be one of: ${VALID_SPORTS.join(', ')}` },
        { status: 400 },
      );
    }

    if (!Array.isArray(reqBody.forecastPeriods) || reqBody.forecastPeriods.length === 0) {
      return NextResponse.json({ error: 'Missing or empty forecastPeriods' }, { status: 400 });
    }

    let sportString = '';
    let sportPrompt = '';

    switch (reqBody.sport) {
      case 'climb':
        sportString = 'rock climbing';
        sportPrompt =
          'Optimal rock climbing conditions are 50-75°F with sunny skies and and wind under 15mph. Wind gusts above 30mph are unfavorable and above 50mph should be avoided. Snow and rain are extremely undesirable, making it impossible to rock climb. Snowfall within a few days prior or heavy rain the day prior could leave the rock wet if not sunny and breezy.';
        break;
      case 'mtb':
        sportString = 'mountain biking';
        sportPrompt =
          'Optimal mountain biking conditions are 50-85°F with sunny skies and wind under 15mph. Below 50°F, sunny and calm conditions are preferable. Above 85°F, seek cloudy skies with a light breeze (up to 15mph). Adjust sendScore for wind speeds above 15mph, visibility issues, and trail conditions from recent heavy rain or snow.';
        break;
      case 'ski':
        sportString = 'skiing';
        sportPrompt =
          'Optimal skiing conditions are 15-45°F with sunny skies and wind speed under 20mph. New snowfall forecasted the night or day before, or on the day the user would engage in skiing is highly desirable. Snowfall amounts above 2 inches are most desireable and increases exponentially with higher snowfall forecasts. High wind and/or low wind chill values are the least desirable conditions for skiing, especially if it is also cloudy. Rain and freezing rain are very unfavorable conditions for skiing.';
        break;
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
      frequency_penalty: 0,
      max_tokens: 448,
      messages: [
        {
          content: JSON.stringify(aiPrompt),
          role: 'system',
        },
        {
          content: JSON.stringify(reqBody.forecastPeriods),
          role: 'user',
        },
      ],
      model: 'gpt-3.5-turbo',
      presence_penalty: 0,
      response_format: { type: 'json_object' },
      temperature: 0.75,
      top_p: 1,
    });

    const rawContent = aiResponse?.choices[0]?.message?.content;
    if (!rawContent) {
      throw new Error('OpenAI response undefined');
    }

    let content: unknown;
    try {
      content = JSON.parse(rawContent);
    } catch {
      console.error('Failed to parse OpenAI response as JSON:', rawContent);
      return NextResponse.json({ error: 'Invalid response from AI model' }, { status: 502 });
    }

    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
