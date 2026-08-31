/** "Nice numbers" tick generation, so axes land on round values. */
function niceNum(range, round) {
  const exp = Math.floor(Math.log10(range))
  const frac = range / 10 ** exp
  let nice
  if (round) {
    if (frac < 1.5) nice = 1
    else if (frac < 3) nice = 2
    else if (frac < 7) nice = 5
    else nice = 10
  } else if (frac <= 1) nice = 1
  else if (frac <= 2) nice = 2
  else if (frac <= 5) nice = 5
  else nice = 10
  return nice * 10 ** exp
}

export function niceTicks(min, max, count = 5) {
  if (min === max) return [min]
  const range = niceNum(max - min, false)
  const step = niceNum(range / (count - 1), true)
  const start = Math.floor(min / step) * step
  const end = Math.ceil(max / step) * step
  const out = []
  // Guard against floating-point drift accumulating across the loop.
  for (let v = start; v <= end + step / 2; v += step) {
    out.push(Math.round(v / step) * step)
  }
  return out
}

/** Fixed-decimal formatter that avoids "-0.00". */
export function fmt(value, decimals = 3) {
  const s = value.toFixed(decimals)
  return s === (0).toFixed(decimals) && value !== 0 ? s : s.replace(/^-0(\.0*)$/, '0$1')
}

export function fmtPct(value, decimals = 2) {
  return `${(value * 100).toFixed(decimals)}%`
}

export function fmtP(p) {
  if (p < 0.001) return '< 0.001'
  return p.toFixed(3)
}

/** 95% confidence interval half-width from a standard error. */
export const ci95 = (se) => 1.96 * se
