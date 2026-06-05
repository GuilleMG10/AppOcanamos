const MAPA_HEAVY = {
  '1 sorbo':      'medio vaso',
  '2 sorbos':     'medio vaso',
  '3 sorbos':     '1 vaso',
  '4 sorbos':     '1 vaso',
  'medio vaso':   '1 vaso y medio',
  '1 vaso':       '2 vasos',
  '2 vasos':      '3 vasos',
  '3 vasos':      '3 vasos',
  'vaso entero':  '2 vasos',
  '1 vaso y medio': '3 vasos',
};

export function escalar(cantidad, modo) {
  if (modo !== 'heavy') return cantidad;
  return (MAPA_HEAVY[cantidad] ?? cantidad) + ' 🔥';
}

export const CANTIDADES_NORMAL = [
  '1 sorbo', '2 sorbos', '3 sorbos', '4 sorbos',
  'medio vaso', '1 vaso', '2 vasos',
];

export const CANTIDADES_HEAVY = [
  'medio vaso', '1 vaso', '1 vaso y medio',
  '2 vasos', '3 vasos',
  '3 segs de trago puro', '4 segs de trago puro',
  '5 segs de trago puro', '6 segs de trago puro',
];

export function getCantidades(modo) {
  return modo === 'heavy' ? CANTIDADES_HEAVY : CANTIDADES_NORMAL;
}

export function getPenalidad(modo) {
  return modo === 'heavy' ? 'medio vaso 🔥' : '2 sorbos';
}
