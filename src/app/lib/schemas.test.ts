import {
  createUserLocationSchema,
  createUserSchema,
  deleteUserLocationSchema,
  patchUserLocationSchema,
  patchUserSchema,
  poiTypeSchema,
  sendScoreRequestSchema,
} from './schemas';

describe('poiTypeSchema', () => {
  it.each(['climb', 'mtb', 'other', 'ski'])('accepts "%s"', (val) => {
    expect(poiTypeSchema.safeParse(val).success).toBe(true);
  });

  it('rejects invalid type', () => {
    expect(poiTypeSchema.safeParse('surf').success).toBe(false);
  });
});

describe('createUserLocationSchema', () => {
  const valid = { latitude: '40.7', longitude: '-74.0', name: 'Test', poi_type: 'climb' };

  it('accepts valid data', () => {
    expect(createUserLocationSchema.safeParse(valid).success).toBe(true);
  });

  it.each(['latitude', 'longitude', 'name'] as const)('rejects empty %s', (field) => {
    expect(createUserLocationSchema.safeParse({ ...valid, [field]: '' }).success).toBe(false);
  });

  it('rejects invalid poi_type', () => {
    expect(createUserLocationSchema.safeParse({ ...valid, poi_type: 'surf' }).success).toBe(false);
  });

  it('rejects missing fields', () => {
    expect(createUserLocationSchema.safeParse({}).success).toBe(false);
  });
});

describe('patchUserLocationSchema', () => {
  it('accepts a name change', () => {
    const result = patchUserLocationSchema.safeParse({
      changeCol: 'name',
      data: 'New Name',
      id: 1,
    });
    expect(result.success).toBe(true);
  });

  it('accepts a poi_type change', () => {
    const result = patchUserLocationSchema.safeParse({
      changeCol: 'poi_type',
      data: 'ski',
      id: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects name longer than 50 characters', () => {
    const result = patchUserLocationSchema.safeParse({
      changeCol: 'name',
      data: 'a'.repeat(51),
      id: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = patchUserLocationSchema.safeParse({
      changeCol: 'name',
      data: '',
      id: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid poi_type data', () => {
    const result = patchUserLocationSchema.safeParse({
      changeCol: 'poi_type',
      data: 'surf',
      id: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid changeCol discriminator', () => {
    const result = patchUserLocationSchema.safeParse({
      changeCol: 'email',
      data: 'x',
      id: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-positive id', () => {
    const result = patchUserLocationSchema.safeParse({
      changeCol: 'name',
      data: 'Test',
      id: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('deleteUserLocationSchema', () => {
  it('accepts valid data', () => {
    expect(deleteUserLocationSchema.safeParse({ id: 1, user_id: 'u1' }).success).toBe(true);
  });

  it('rejects non-positive id', () => {
    expect(deleteUserLocationSchema.safeParse({ id: -1, user_id: 'u1' }).success).toBe(false);
  });

  it('rejects empty user_id', () => {
    expect(deleteUserLocationSchema.safeParse({ id: 1, user_id: '' }).success).toBe(false);
  });
});

describe('createUserSchema', () => {
  const valid = { email: 'test@example.com', id: 'u1', name: 'Alice' };

  it('accepts valid data', () => {
    expect(createUserSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(createUserSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects empty id', () => {
    expect(createUserSchema.safeParse({ ...valid, id: '' }).success).toBe(false);
  });

  it('rejects empty name', () => {
    expect(createUserSchema.safeParse({ ...valid, name: '' }).success).toBe(false);
  });
});

describe('patchUserSchema', () => {
  it('accepts id with optional email and name', () => {
    expect(patchUserSchema.safeParse({ id: 'u1' }).success).toBe(true);
    expect(
      patchUserSchema.safeParse({ email: 'new@example.com', id: 'u1', name: 'Bob' }).success,
    ).toBe(true);
  });

  it('rejects empty id', () => {
    expect(patchUserSchema.safeParse({ id: '' }).success).toBe(false);
  });

  it('rejects invalid email when provided', () => {
    expect(patchUserSchema.safeParse({ email: 'bad', id: 'u1' }).success).toBe(false);
  });
});

describe('sendScoreRequestSchema', () => {
  const valid = {
    forecastPeriods: [{ detailedForecast: 'Sunny.', name: 'Today' }],
    sport: 'climb' as const,
  };

  it('accepts valid data', () => {
    expect(sendScoreRequestSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects sport "other"', () => {
    expect(sendScoreRequestSchema.safeParse({ ...valid, sport: 'other' }).success).toBe(false);
  });

  it('rejects empty forecastPeriods', () => {
    expect(sendScoreRequestSchema.safeParse({ ...valid, forecastPeriods: [] }).success).toBe(false);
  });

  it('rejects missing sport', () => {
    expect(
      sendScoreRequestSchema.safeParse({ forecastPeriods: valid.forecastPeriods }).success,
    ).toBe(false);
  });
});
