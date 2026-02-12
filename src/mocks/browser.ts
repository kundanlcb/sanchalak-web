import { setupWorker } from 'msw/browser';
import type { RequestHandler } from 'msw';
import * as handlers from './handlers';

// Flatten the handlers object into an array
const handlerList = Object.values(handlers).flat() as RequestHandler[];

export const worker = setupWorker(...handlerList);
