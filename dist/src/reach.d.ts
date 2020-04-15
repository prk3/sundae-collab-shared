import jot from 'jot';
export declare type OperationEnhancer = (op: jot.Operation) => jot.Operation;
/**
 * Extracts a part of a document pointed by path (JSON pointer string).
 * Returns a tuple with a value and a function that wraps jot operation
 * with necessary ATINDEX and APPLY operations so that it affects correct,
 * possibly nested field. jot dependency must be passed as an argument.
 */
export default function reach(doc: jot.Document, path: string, explicitJot: typeof jot): [jot.Document, OperationEnhancer];
