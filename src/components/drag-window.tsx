import { MouseEvent, useState } from "react";

import { TResizeType, useResize } from "../hooks/use-resize";
import { DragDiv } from "./drag-div";
import { Icons } from "./icons";

interface IPosition {
    x: number;
    y: number;
}

interface IDragWindowProps {
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
}

export const DragWindow = ({ isDragging, setIsDragging }: IDragWindowProps) => {
    const innerDivRect = document
        .getElementById("drag-div")
        ?.getBoundingClientRect();
    const parentRect = document
        .getElementById("main-window")
        ?.getBoundingClientRect();
    const [isInnerDivDragging, setIsInnerDivDragging] =
        useState<boolean>(false);
    const [position, setPosition] = useState<IPosition>({ x: 0, y: 0 });
    const { handleResize, resizeType } = useResize({
        resizeDivId: "drag-window",
        options: {
            minWidth: innerDivRect?.width,
            minHeight: innerDivRect?.height,
            maxHeight: parentRect?.height,
            maxWidth: parentRect?.width,
        },
    });

    const startPosition: IPosition = { x: 0, y: 0 };

    const handleDrag = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const dragWindowRect = document
            .getElementById("drag-window")
            ?.getBoundingClientRect();

        setIsDragging(true);

        startPosition.x = dragWindowRect!.x;
        startPosition.y = dragWindowRect!.y;

        const handleMouseMove = (e: MouseEvent) => {
            const parentRect = document
                .getElementById("main-window")
                ?.getBoundingClientRect();
            const dragWindowRect = document
                .getElementById("drag-window")
                ?.getBoundingClientRect();

            const newX = e.pageX - dragWindowRect!.width + 20;
            const newY = e.pageY - 20;

            const maxX = parentRect && parentRect.width - dragWindowRect!.width;
            const maxY =
                parentRect && parentRect.height - dragWindowRect!.height;

            const boundedX = Math.min(Math.max(newX, 0), maxX ? maxX : 0);
            const boundedY = Math.min(Math.max(newY, 0), maxY ? maxY : 0);

            setPosition({ x: boundedX, y: boundedY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            // @ts-expect-error -- pass event on function
            document.body.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseup", handleMouseUp);
        };

        // @ts-expect-error -- pass event on function
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    const handleDivResize = (e: React.MouseEvent, type: TResizeType) => {
        e.preventDefault();
        e.stopPropagation();
        handleResize(e, type);
        const dragDiv = document.getElementById("drag-div");
        const dragDivRect = dragDiv?.getBoundingClientRect();

        const handleMouseMove = (e: React.MouseEvent) => {
            const dragWindowRect = document
                .getElementById("drag-window")
                ?.getBoundingClientRect();

            switch (type) {
                case "right": {
                    if (
                        dragWindowRect!.x <= e.pageX - dragDivRect!.width &&
                        dragDivRect!.x + dragDivRect!.width > e.pageX
                    ) {
                        dragDiv!.style.left = `${
                            e.pageX - dragWindowRect!.x - dragDivRect!.width
                        }px`;
                    }
                    break;
                }
                case "bottom": {
                    if (
                        dragWindowRect!.y <= e.pageY - dragDivRect!.height &&
                        dragDivRect!.y + dragDivRect!.height > e.pageY
                    ) {
                        dragDiv!.style.top = `${
                            e.pageY - dragWindowRect!.y - dragDivRect!.height
                        }px`;
                    }
                    break;
                }
                case "bottom-right": {
                    if (
                        dragWindowRect!.x <= e.pageX - dragDivRect!.width &&
                        dragDivRect!.x + dragDivRect!.width > e.pageX
                    ) {
                        dragDiv!.style.left = `${
                            e.pageX - dragWindowRect!.x - dragDivRect!.width
                        }px`;
                    }
                    if (
                        dragWindowRect!.y <= e.pageY - dragDivRect!.height &&
                        dragDivRect!.y + dragDivRect!.height > e.pageY
                    ) {
                        dragDiv!.style.top = `${
                            e.pageY - dragWindowRect!.y - dragDivRect!.height
                        }px`;
                    }
                    break;
                }
                // case "left": {
                //     if (
                //         dragWindowRect!.x + dragWindowRect!.width >=
                //         e.pageX + dragDivRect!.width
                //     ) {
                //         console.log("left");
                //         // dragDiv!.style.left = `${
                //         //     e.pageX - dragWindowRect!.x
                //         // }px`;
                //     }
                //     break;
                // }
            }
        };

        const handleMouseUp = () => {
            // @ts-expect-error -- pass event on function
            document.body.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseup", handleMouseUp);
        };

        // @ts-expect-error -- pass event on function
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div
            id="drag-window"
            className={`drag-window ${
                (isInnerDivDragging || isDragging) && "dragging"
            }`}
            style={{
                top: position.y,
                left: position.x,
            }}
        >
            <DragDiv
                isDragging={isInnerDivDragging}
                setIsDragging={setIsInnerDivDragging}
            />
            <div
                className="drag-window-handle"
                onMouseDown={(e) => handleDrag(e)}
            >
                <Icons
                    name="grip-vertical"
                    size={24}
                    style={{
                        paddingTop: "8px",
                    }}
                />
            </div>

            <div className="resize-indicator">
                <Icons name="resize-right" size={14} color="gray" />
            </div>
            {/* Resize handler */}
            <div
                className={`right-resize-handle ${
                    (resizeType === "right" || resizeType === "bottom-right") &&
                    "active"
                }`}
                onMouseDown={(e) => handleDivResize(e, "right")}
            ></div>
            <div
                className={`left-resize-handle ${
                    (resizeType === "left" || resizeType === "top-left") &&
                    "active"
                }`}
                onMouseDown={(e) => handleDivResize(e, "left")}
            ></div>
            <div
                className={`top-resize-handle ${
                    (resizeType === "top" || resizeType === "top-left") &&
                    "active"
                }`}
                onMouseDown={(e) => handleDivResize(e, "top")}
            ></div>
            <div
                className={`bottom-resize-handle ${
                    (resizeType === "bottom" ||
                        resizeType === "bottom-right") &&
                    "active"
                }`}
                onMouseDown={(e) => handleDivResize(e, "bottom")}
            ></div>
            <div
                className="top-right-resize-handle"
                onMouseDown={(e) => handleResize(e, "top-right")}
            ></div>
            <div
                className="top-left-resize-handle"
                onMouseDown={(e) => handleDivResize(e, "top-left")}
            ></div>
            <div
                className="bottom-right-resize-handle"
                onMouseDown={(e) => handleDivResize(e, "bottom-right")}
            ></div>
            <div
                className="bottom-left-resize-handle"
                onMouseDown={(e) => handleDivResize(e, "bottom-left")}
            ></div>
        </div>
    );
};
