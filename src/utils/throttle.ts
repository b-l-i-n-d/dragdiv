export function throttle<T extends (...args: never[]) => void>(
    func: T,
    limit: number
) {
    let inThrottle = false;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}
