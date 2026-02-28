export type FareMode = 'bus' | 'bus+walking' | 'auto' | 'e-rickshaw' | 'car' | 'walking' | 'cycling';

const ceilDiv = (a: number, b: number) => Math.ceil(a / b);

export function calculateFare(mode: FareMode, distanceKm: number): number {
  const d = Math.max(0, distanceKm || 0);

  if (mode === 'walking' || mode === 'cycling') return 0;

  if (mode === 'bus') {

    return 20;
  }

  if (mode === 'bus+walking') {

    return 15;
  }

  if (mode === 'auto') {

    if (d <= 2) return 10;
    const extra = d - 2;
    return 10 + (ceilDiv(extra, 2) * 5);
  }

  if (mode === 'e-rickshaw') {

    return 60;
  }

  if (mode === 'car') {

    return Math.round(d * 15);
  }

  return 0;
}
