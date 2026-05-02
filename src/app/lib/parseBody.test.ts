/**
 * @jest-environment node
 */
import { z } from 'zod';

import { parseBody } from './parseBody';

const testSchema = z.object({
  name: z.string().min(1),
  value: z.number(),
});

function makeRequest(body: unknown): Request {
  return new Request('http://localhost', {
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
}

describe('parseBody', () => {
  it('returns parsed data for a valid body', async () => {
    const result = await parseBody(makeRequest({ name: 'test', value: 42 }), testSchema);
    expect(result.data).toEqual({ name: 'test', value: 42 });
    expect(result.error).toBeNull();
  });

  it('returns 400 error for malformed JSON', async () => {
    const request = new Request('http://localhost', {
      body: '{not valid json',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    const result = await parseBody(request, testSchema);
    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error!.status).toBe(400);
    const json = await result.error!.json();
    expect(json.error).toBe('Invalid JSON body');
  });

  it('returns 400 error with details for schema mismatch', async () => {
    const result = await parseBody(makeRequest({ name: '', value: 'not-a-number' }), testSchema);
    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error!.status).toBe(400);
    const json = await result.error!.json();
    expect(json.details).toBeDefined();
    expect(json.error).toBe('Invalid request body');
  });
});
