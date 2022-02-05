import pino from 'pino';

import { logLevel } from '../env';

export const baseLogger = pino({ level: logLevel });
