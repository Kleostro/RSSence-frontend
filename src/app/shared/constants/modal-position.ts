const MODAL_POSITION_DIRECTION = {
  CENTER: 'center',
  CENTER_BOTTOM: 'center-bottom',
  CENTER_LEFT: 'center-left',
  CENTER_RIGHT: 'center-right',
  CENTER_TOP: 'center-top',
  LEFT_BOTTOM: 'left-bottom',
  LEFT_TOP: 'left-top',
  RIGHT_BOTTOM: 'right-bottom',
  RIGHT_TOP: 'right-top',
} as const;

export const MODAL_POSITION_OFFSETS = {
  center: 'top: 50%; left: 50%; transform: translate(-50%, -50%);',
  'center-bottom': 'bottom: 1rem; left: 50%; transform: translate(-50%, 0);',
  'center-left': 'top: 50%; left: 1rem; transform: translate(0, -50%);',
  'center-right': 'top: 50%; right: 1rem; transform: translate(0, -50%);',
  'center-top': 'top: 1rem; left: 50%; bottom: 1rem; transform: translate(-50%, 0);',
  'left-bottom': 'bottom: 1rem; left: 1rem;',
  'left-top': 'top: 1rem; left: 1rem;',
  'right-bottom': 'bottom: 1rem; right: 1rem;',
  'right-top': 'top: 1rem; right: 1rem;',
};
export default MODAL_POSITION_DIRECTION;
