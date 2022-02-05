import { Kind } from 'graphql';
import { DateTime } from 'luxon';
import { scalarType } from 'nexus';

export const GQLDateTime = scalarType({
  name: 'DateTime',
  asNexusMethod: 'dateTime',
  description: 'A timestamp.',
  sourceType: 'Date',
  serialize(value: Date) {
    return DateTime.fromJSDate(value, { zone: 'utc' }).toISO();
  },
  parseValue(value: number | string | Date) {
    if (value instanceof Date) {
      return DateTime.fromJSDate(value, { zone: 'utc' }).toJSDate();
    }

    if (typeof value === 'string') {
      return DateTime.fromISO(value, { zone: 'utc' }).toJSDate();
    }

    return DateTime.fromMillis(value, { zone: 'utc' }).toJSDate();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return DateTime.fromMillis(+ast.value, { zone: 'utc' }).toJSDate();
    }

    if (ast.kind === Kind.STRING) {
      return DateTime.fromISO(ast.value, { zone: 'utc' }).toJSDate();
    }

    return null;
  },
});
