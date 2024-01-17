import { useEffect } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
    children: React.ReactNode;
    target?: HTMLElement;
}

export const Portal = ({ children, target }: PortalProps) => {
    let root: HTMLElement;
    let el: HTMLDivElement | null = null; // Initialize with a default value of null
    if (typeof window === "object") {
        if (target) {
            root = document.getElementById("root") as HTMLElement;
        }
        el = document.createElement("div");
        el.setAttribute("style", "position:relative");
        el.id = "portal-root";
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
        // @ts-expect-error - This is a hack to get rid of the warning
    }, [el, root.nextSibling, root.parentElement]);

    return createPortal(children, el!); // Use the non-null assertion operator to indicate that 'el' will not be null at this point
};
