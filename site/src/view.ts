// The registry that the playground gives to dispatch: a full viewer set, less the viewers that the visitor turned off.
import type { DataType, Registry } from "@mark1russell7/splay";

/** The types of the viewer sets of the page, in the order of the toggles. */
export const VIEWER_TYPES = ["string", "number", "boolean", "null", "date", "array", "object", "money", "color"] as const;

/** The count of the dispatch calls of one run, for each type: the calls that found a viewer, and the calls that did not. */
export interface Tally {
  readonly viewed: Map<DataType, number>;
  readonly missed: Map<DataType, number>;
}

/** This function makes an empty tally. */
export function tally(): Tally {
  return { viewed: new Map(), missed: new Map() };
}

/** This function gives the count of all the calls of a tally. */
export function calls(t: Tally): number {
  let n = 0;
  for (const map of [t.viewed, t.missed]) for (const count of map.values()) n += count;
  return n;
}

/**
 * This function gives a registry that has the viewers of `base`, less the types of `off`. Dispatch calls `get` one time
 * for each value, so the registry also counts the calls in `t`.
 */
export function view<Output>(base: Registry<Output>, off: ReadonlySet<DataType>, t: Tally): Registry<Output> {
  const bump = (map: Map<DataType, number>, type: DataType): void => {
    map.set(type, (map.get(type) ?? 0) + 1);
  };
  return {
    register: base.register,
    has: (type) => !off.has(type) && base.has(type),
    get: (type) => {
      const factory = off.has(type) ? undefined : base.get(type);
      bump(factory ? t.viewed : t.missed, type);
      return factory;
    },
  };
}
