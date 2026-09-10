/**
 * Assigns a color per segment by cycling through `colors`. Cycling already
 * guarantees that two consecutive items in a linear sequence never repeat
 * a color (as long as `colors.length >= 2`). The only failure case is the
 * "wraparound" of a circular sequence (e.g. the wheel): when
 * `count % colors.length === 1` the last computed color matches the first.
 * That case is fixed by swapping the last color for one that differs from
 * both the second-to-last and the first.
 */
export function getWheelSegmentColors(
  count: number,
  colors: readonly string[],
  circular = false
): string[] {
  if (count <= 0 || colors.length === 0) return [];

  const result = Array.from({ length: count }, (_, i) => colors[i % colors.length]);

  if (circular && count > 1 && result[count - 1] === result[0]) {
    const prev = result[count - 2];
    const alt = colors.find((c) => c !== prev && c !== result[0]);
    if (alt) result[count - 1] = alt;
  }

  return result;
}
