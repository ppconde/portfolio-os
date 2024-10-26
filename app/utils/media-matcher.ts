export const isTouchDevice = () => {
    return window.matchMedia('(pointer: coarse)').matches;
};
