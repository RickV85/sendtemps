import { NextResponse } from 'next/server';
import { z } from 'zod';

type ParseSuccess<T> = { data: T; error: null };
type ParseFailure = { data: null; error: NextResponse };

export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<ParseSuccess<T> | ParseFailure> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      data: null,
      error: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      data: null,
      error: NextResponse.json(
        { details: result.error.flatten(), error: 'Invalid request body' },
        { status: 400 },
      ),
    };
  }

  return { data: result.data, error: null };
}
