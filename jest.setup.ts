import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { expect } from '@jest/globals';
import { toHaveNoViolations } from 'jest-axe';
import { server } from './src/test/server';

expect.extend(toHaveNoViolations);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
