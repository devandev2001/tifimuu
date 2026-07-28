/**
 * Helpers for floating-site panels that scroll their own content
 * while still allowing wheel/swipe to change panels at the edges.
 */

export type PanelScrollState = {
  element: HTMLElement | null;
  canScroll: boolean;
  atTop: boolean;
  atBottom: boolean;
};

const EDGE_PX = 3;

export function getPanelScrollState(
  root: ParentNode | null | undefined,
): PanelScrollState {
  const element =
    root?.querySelector<HTMLElement>("[data-panel-scroll]") ?? null;
  if (!element) {
    return { element: null, canScroll: false, atTop: true, atBottom: true };
  }

  const maxScroll = element.scrollHeight - element.clientHeight;
  const canScroll = maxScroll > EDGE_PX;
  const atTop = element.scrollTop <= EDGE_PX;
  const atBottom = element.scrollTop >= maxScroll - EDGE_PX;

  return { element, canScroll, atTop, atBottom };
}

/**
 * Returns whether wheel/swipe should change panels instead of scrolling content.
 * - No scrollable region → always navigate
 * - Scrollable with room → keep scrolling
 * - At edge in the gesture direction → navigate
 */
export function shouldNavigateFromScrollGesture(
  state: PanelScrollState,
  deltaY: number,
): boolean {
  if (!state.canScroll) return true;
  if (deltaY > 0) return state.atBottom;
  if (deltaY < 0) return state.atTop;
  return false;
}
