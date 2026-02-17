export const formatPreparationTime = (minutes: number) => {
	if (minutes < 60) {
		return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (remainingMinutes === 0) {
		return `${hours} hour${hours !== 1 ? "s" : ""}`;
	}

	return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${
		remainingMinutes !== 1 ? "s" : ""
	}`;
};

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

function toCamelCase(key: string): string {
	return key.replace(/[-_]+(.)?/g, (_, char) =>
		char ? char.toUpperCase() : "",
	);
}

type Camelize<T> = T extends Primitive
	? T
	: T extends Array<infer U>
		? Camelize<U>[]
		: T extends object
			? {
					[K in keyof T as K extends string
						? Uncapitalize<string & CamelCase<K>>
						: K]: Camelize<T[K]>;
				}
			: T;

type CamelCase<S extends string> = S extends `${infer P}_${infer R}`
	? `${Lowercase<P>}${Capitalize<CamelCase<R>>}`
	: S extends `${infer P}-${infer R}`
		? `${Lowercase<P>}${Capitalize<CamelCase<R>>}`
		: Lowercase<S>;

export function camelizeKeys<T>(input: T): Camelize<T> {
	if (Array.isArray(input)) {
		return input.map(camelizeKeys) as Camelize<T>;
	}

	if (input !== null && typeof input === "object") {
		const result: Record<string, any> = {};

		for (const [key, value] of Object.entries(input)) {
			const camelKey = toCamelCase(key);
			result[camelKey] = camelizeKeys(value as any);
		}

		return result as Camelize<T>;
	}

	return input as Camelize<T>;
}
