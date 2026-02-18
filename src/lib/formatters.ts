export const formatPreparationTime = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${
    remainingMinutes !== 1 ? 's' : ''
  }`;
};
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

function toCamelCase(key: string): string {
  return key.replace(/[-_]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''));
}

type Camelize<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Camelize<U>[]
    : T extends object
      ? {
          [K in keyof T as K extends string ? CamelizeKey<K> : K]: Camelize<T[K]>;
        }
      : T;

// New type to handle the camelCase conversion without forcing lowercase
type CamelizeKey<S extends string> = S extends `${infer P}_${infer R}`
  ? `${P}${Capitalize<CamelizeKey<R>>}`
  : S extends `${infer P}-${infer R}`
    ? `${P}${Capitalize<CamelizeKey<R>>}`
    : S;

export function camelizeKeys<T>(input: T): Camelize<T> {
  if (Array.isArray(input)) {
    return input.map(camelizeKeys) as Camelize<T>;
  }

  if (input !== null && typeof input === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
      const camelKey = toCamelCase(key);
      result[camelKey] = camelizeKeys(value);
    }

    return result as Camelize<T>;
  }

  return input as Camelize<T>;
}
