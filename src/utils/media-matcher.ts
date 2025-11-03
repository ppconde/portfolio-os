/**
 * Check if the device is a touch device
 * @returns boolean
 */
export const isTouchDevice = () => {
  return window.matchMedia('(pointer: coarse)').matches;
};
