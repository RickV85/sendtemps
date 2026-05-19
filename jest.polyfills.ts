/**
 * Polyfills required by the jsdom test environment before any test modules load.
 * Runs via `setupFiles` which executes before `setupFilesAfterEnv`.
 * MSW 2.x requires Web Streams API and encoding globals unavailable in jsdom.
 */
import { TextDecoder, TextEncoder } from 'util';
import { ReadableStream, TransformStream, WritableStream } from 'stream/web';
import { BroadcastChannel } from 'worker_threads';

Object.assign(global, {
  BroadcastChannel,
  ReadableStream,
  TextDecoder,
  TextEncoder,
  TransformStream,
  WritableStream,
});
