import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
    children: React.ReactNode;
    target?: HTMLElement;
}

export const Portal = ({ children, target }: PortalProps) => {
    const id = useId();
    let root: HTMLElement;
    let el: HTMLDivElement | null = null;
    if (typeof window === "object") {
        if (target) {
            root = document.getElementById("root") as HTMLElement;
        }
        el = document.createElement("div");
        el.setAttribute("style", "position:relative");
        el.id = `portal-root-${id}`;
    }

    useEffect(() => {
        if (el) {
            root.parentElement?.insertBefore(
                el,
                root.nextSibling
            ) as HTMLElement;
        }

        return () => {
            if (el) {
                el.remove();
            }
        };
        // @ts-expect-error - dumb ts, shut up!
    }, [el, root.nextSibling, root.parentElement]);

    return createPortal(children, el!);
};
