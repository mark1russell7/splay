export function arrayPath(parent: string, index: number): string {
  return `${parent}[${index}]`;
}

export function objectPath(parent: string, key: string): string {
  return `${parent}.${key}`;
}

export function pathDepth(path: string): number {
  return path.split(".").length;
}
