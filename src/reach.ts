import jot from 'jot';

class BadPath extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

const INTEGER_REGEX = /^([1-9][0-9]*|0)$/;

export type OperationEnhancer = (op: jot.Operation) => jot.Operation;

/**
 * Extracts a part of a document pointed by path (JSON pointer string).
 * Returns a tuple with a value and a function that wraps jot operation
 * with necessary ATINDEX and APPLY operations so that it affects correct,
 * possibly nested field. jot dependency must be passed as an argument.
 */
export default function reach(
  doc: jot.Document,
  path: string,
  explicitJot: typeof jot,
): [jot.Document, OperationEnhancer] {
  const fields = path === '' ? [] : path.split('/').slice(1);
  const enhancers: OperationEnhancer[] = [];
  let value = doc;

  while (fields.length > 0) {
    const field = fields.shift() as string;

    if (Array.isArray(value)) {
      if (!field.match(INTEGER_REGEX)) {
        throw new BadPath('Non integer array index.');
      }
      const index = Number(field);
      if (index >= value.length) {
        throw new BadPath('Index out of bounds.');
      }
      enhancers.push((op) => new explicitJot.ATINDEX(index, op));
      value = value[index];
    } else if (typeof value === 'object' && value) {
      if (!(field in value)) {
        throw new BadPath('Property missing.');
      }
      enhancers.push((op) => new explicitJot.APPLY(field, op));
      value = value[field];
    } else {
      throw new BadPath('Path dereferences null or primitive.');
    }
  }

  return [value, (op) => enhancers.reduceRight((acc, enhancer) => enhancer(acc), op)];
}
