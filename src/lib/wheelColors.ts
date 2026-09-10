/**
 * Atribui uma cor por segmento ciclando `colors`. Ciclar já garante que
 * dois itens consecutivos numa sequência linear nunca repitam cor (desde
 * que `colors.length >= 2`). A única falha possível é no "encontro" de
 * uma sequência circular (ex. roleta): quando `count % colors.length === 1`
 * a última cor calculada coincide com a primeira. Esse caso é corrigido
 * trocando a última cor por outra que difira tanto da penúltima quanto
 * da primeira.
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
