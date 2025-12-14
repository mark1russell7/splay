import type { DataType, ViewerFactory } from "./types.js";

export interface Registry<Output> {
  register: (type: DataType, factory: ViewerFactory<Output>) => void;
  get: (type: DataType) => ViewerFactory<Output> | undefined;
  has: (type: DataType) => boolean;
}

export function createRegistry<Output>(): Registry<Output> {
  const viewers = new Map<DataType, ViewerFactory<Output>>();
  return {
    register: (type: DataType, factory: ViewerFactory<Output>): void => {
      viewers.set(type, factory);
    },
    get: (type: DataType): ViewerFactory<Output> | undefined => viewers.get(type),
    has: (type: DataType): boolean => viewers.has(type),
  };
}
