export const doubleTouch = (lastTap: number, onDoubleClick: () => void) => {
    const currentTime = new Date().getTime();
    const tapInterval = currentTime - lastTap;

    if (tapInterval < 300 && tapInterval > 0) {
        onDoubleClick();
    }

    return currentTime;
};