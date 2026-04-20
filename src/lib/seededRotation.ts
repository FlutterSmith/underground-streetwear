function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cache = new Map<string, number>();

export function rotationFor(id: string, range = 8): number {
  const key = `${id}:${range}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const rng = mulberry32(hashString(id));
  const value = (rng() * 2 - 1) * range;
  cache.set(key, value);
  return value;
}
