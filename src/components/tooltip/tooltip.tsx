import { useEffect, useId, useRef, useState } from "react";

import { Portal } from "../portal";

import styles from "./tooltip.module.scss";

type Direction = "top" | "bottom" | "left" | "right";

interface TooltipProps {
    children: React.ReactNode;
    direction?: Direction;
    // delay?: number;
    content: React.ReactNode;
}

export const Tooltip = ({
    children,
    direction,
    // delay,
    content,
}: TooltipProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [calculatedDirection, setCalculatedDirection] = useState<Direction>(
        direction || "top"
    );
    const id = useId();
    const [position, setPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [active, setActive] = useState(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    // let timeout: number | undefined;

    const handleMouseOver = () => {
        if (isDragging) return;

        // timeout = setTimeout(() => {
        setActive(true);
        // }, delay || 400);
    };

    const handleMouseLeave = () => {
        // clearInterval(timeout);
        setActive(false);
        setPosition(null);
    };

    const onPointerDown = (event: React.PointerEvent) => {
        (event.target as HTMLDivElement).setPointerCapture(event.pointerId);
        setIsDragging(true);
        setActive(false);
    };

    const onPointerUp = (event: React.PointerEvent) => {
        (event.target as HTMLDivElement).releasePointerCapture(event.pointerId);
        setIsDragging(false);
    };

    const calculatePosition = (bounds: DOMRect, tooltipBounds: DOMRect) => {
        const {
            x: innerX,
            y: innerY,
            width: innerWidth,
            height: innerHeight,
        } = document.getElementById("drag-window")!.getBoundingClientRect();
        const positions: {
            [key: string]: {
                x: number;
                y: number;
            };
        } = {
            top: {
                x: bounds.x + bounds.width / 2,
                y: bounds.y - tooltipBounds?.height - 5,
            },
            bottom: {
                x: bounds.x + bounds.width / 2,
                y: bounds.y + bounds.height + 5,
            },
            left: {
                x: bounds.x - tooltipBounds?.width - 5,
                y: bounds.y + bounds.height / 2,
            },
            right: {
                x: bounds.x + bounds.width + 5,
                y: bounds.y + bounds.height / 2,
            },
        };

        if (
            bounds.y - tooltipBounds?.height - 2 < innerY &&
            direction === "top"
        ) {
            setCalculatedDirection("bottom");
            setPosition(positions["bottom"]);
            return;
        }

        if (
            bounds.x - tooltipBounds?.width - 2 < innerX &&
            direction === "left"
        ) {
            setCalculatedDirection("right");
            setPosition(positions["right"]);
            return;
        }

        if (
            bounds.x - 2 + bounds.width + tooltipBounds?.width >
                innerX + innerWidth &&
            direction === "right"
        ) {
            setCalculatedDirection("left");
            setPosition(positions["left"]);
            return;
        }

        if (
            bounds.y - 2 + bounds.height + tooltipBounds?.height >
                innerY + innerHeight &&
            direction === "bottom"
        ) {
            setCalculatedDirection("top");
            setPosition(positions["top"]);
            return;
        }

        setCalculatedDirection(direction || "top");
        setPosition(positions[direction!]);
    };

    useEffect(() => {
        const bounds = triggerRef.current?.getBoundingClientRect();
        const tooltipBounds = tooltipRef.current?.getBoundingClientRect();

        calculatePosition(bounds as DOMRect, tooltipBounds as DOMRect);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    return (
        <>
            <div
                ref={triggerRef}
                className={styles.tooltipWrapper}
                onMouseEnter={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
            >
                {children}
            </div>
            {active && (
                <Portal target={triggerRef.current || undefined}>
                    <div
                        id={`tooltip-${id}`}
                        ref={tooltipRef}
                        style={{
                            top: (position && position.y) || 0,
                            left: (position && position.x) || 0,
                        }}
                        className={`${styles.tooltipTip} ${styles[calculatedDirection]}`}
                    >
                        {content}
                    </div>
                </Portal>
            )}
        </>
    );
};
