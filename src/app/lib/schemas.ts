import { z } from 'zod';

export const poiTypeSchema = z.enum(['climb', 'mtb', 'other', 'ski']);

// user_locations schemas
export const createUserLocationSchema = z.object({
  latitude: z.string().min(1),
  longitude: z.string().min(1),
  name: z.string().min(1),
  poi_type: poiTypeSchema,
});

export const patchUserLocationSchema = z.discriminatedUnion('changeCol', [
  z.object({
    changeCol: z.literal('name'),
    data: z.string().min(1).max(50),
    id: z.number().int().positive(),
  }),
  z.object({
    changeCol: z.literal('poi_type'),
    data: poiTypeSchema,
    id: z.number().int().positive(),
  }),
]);

export const deleteUserLocationSchema = z.object({
  id: z.number().int().positive(),
  user_id: z.string().min(1),
});

// users schemas
export const createUserSchema = z.object({
  email: z.email(),
  id: z.string().min(1),
  name: z.string().min(1),
});

export const patchUserSchema = z.object({
  email: z.email().optional(),
  id: z.string().min(1),
  name: z.string().min(1).optional(),
});

// open_ai/send_score schemas
export const forecastPeriodSchema = z.object({
  detailedForecast: z.string(),
  name: z.string(),
});

export const sendScoreRequestSchema = z.object({
  forecastPeriods: z.array(forecastPeriodSchema).min(1),
  sport: z.enum(['climb', 'mtb', 'ski']),
});

export type CreateUserLocationInput = z.infer<typeof createUserLocationSchema>;
export type PatchUserLocationInput = z.infer<typeof patchUserLocationSchema>;
export type DeleteUserLocationInput = z.infer<typeof deleteUserLocationSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type PatchUserInput = z.infer<typeof patchUserSchema>;
export type SendScoreRequest = z.infer<typeof sendScoreRequestSchema>;
