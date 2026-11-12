/**
 * Shared reduced-motion check. Blocks import this from /scripts/ instead of
 * each calling matchMedia themselves.
 * @returns {boolean} true when the visitor asked for reduced motion
 */
// eslint-disable-next-line import/prefer-default-export
export function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
