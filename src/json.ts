// type definitions of json compatible data
// undefined is a possible object property value and indicates optional prop
export type JsonData = string | number | boolean | null | JsonData[] | { [key: string]: JsonData | undefined };
export type JsonObject = { [key: string]: JsonData | undefined };
export type JsonArray = JsonData[];

/**
 * Ensures T is JSON data or else the compiler throws an error.
 */
export type ForceJson<T> = T extends JsonData ? T : never;
