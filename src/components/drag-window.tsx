import { MouseEvent, useState } from "react";

import { DragDiv } from "./drag-div";
import { Icons } from "./icons";

interface IPosition {
    x: number;
    y: number;
}

interface ISize {
    width: number;
    height: number;
}

type TResizeType =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

interface IDragWindowProps {
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
}

export const DragWindow = ({ isDragging, setIsDragging }: IDragWindowProps) => {
    const [isInnerDivDragging, setIsInnerDivDragging] =
        useState<boolean>(false);
    const [position, setPosition] = useState<IPosition>({ x: 0, y: 0 });
    const [size, setSize] = useState<ISize>({ width: 200, height: 200 });
    const [resizeType, setResizeType] = useState<TResizeType | null>(null);

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

    const handleResize = (e: MouseEvent, type: TResizeType) => {
        e.preventDefault();
        e.stopPropagation();

        const startSize = size;
        const startPosition = {
            x: e.pageX,
            y: e.pageY,
        };

        const handleMouseMove = (e: MouseEvent) => {
            const parentRect = document
                .getElementById("main-window")
                ?.getBoundingClientRect();

            const deltaX = e.pageX - startPosition.x;
            const deltaY = e.pageY - startPosition.y;

            const newWidth = startSize.width + deltaX;
            const newHeight = startSize.height + deltaY;

            const maxX = parentRect ? parentRect.x + parentRect.width : 0;
            const maxY = parentRect ? parentRect.y + parentRect.height : 0;

            const boundedWidth = Math.min(Math.max(newWidth, 0), maxX);
            const boundedHeight = Math.min(Math.max(newHeight, 0), maxY);

            setResizeType(type);

            switch (type) {
                case "top":
                    setSize({
                        width: size.width,
                        height: startSize.height - deltaY,
                    });
                    setPosition({
                        x: position.x,
                        y: position.y + deltaY,
                    });
                    return;
                case "bottom":
                    setSize({
                        width: size.width,
                        height: boundedHeight,
                    });
                    return;
                case "left":
                    setSize({
                        width: startSize.width - deltaX,
                        height: size.height,
                    });
                    setPosition({
                        x: position.x + deltaX,
                        y: position.y,
                    });
                    return;
                case "right":
                    setSize({
                        width: boundedWidth,
                        height: size.height,
                    });
                    return;
                case "top-left":
                    setSize({
                        width: startSize.width - deltaX,
                        height: startSize.height - deltaY,
                    });
                    setPosition({
                        x: position.x + deltaX,
                        y: position.y + deltaY,
                    });
                    return;
                case "top-right":
                    setSize({
                        width: boundedWidth,
                        height: startSize.height - deltaY,
                    });
                    setPosition({
                        x: position.x,
                        y: position.y + deltaY,
                    });
                    return;
                case "bottom-left":
                    setSize({
                        width: startSize.width - deltaX,
                        height: boundedHeight,
                    });
                    setPosition({
                        x: position.x + deltaX,
                        y: position.y,
                    });
                    return;
                case "bottom-right":
                    setSize({
                        width: boundedWidth,
                        height: boundedHeight,
                    });
                    return;
            }
        };

        const handleMouseUp = () => {
            // @ts-expect-error -- pass event on function
            document.body.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseup", handleMouseUp);
            setResizeType(null);
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
                width: size.width,
                height: size.height,
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
                <Icons name="resize-right" size={14} />
            </div>
            {/* Resize handler */}
            <div
                className={`right-resize-handle ${
                    (resizeType === "right" || resizeType === "bottom-right") &&
                    "active"
                }`}
                onMouseDown={(e) => handleResize(e, "right")}
            ></div>
            <div
                className={`left-resize-handle ${
                    (resizeType === "left" || resizeType === "top-left") &&
                    "active"
                }`}
                onMouseDown={(e) => handleResize(e, "left")}
            ></div>
            <div
                className={`top-resize-handle ${
                    (resizeType === "top" || resizeType === "top-left") &&
                    "active"
                }`}
                onMouseDown={(e) => handleResize(e, "top")}
            ></div>
            <div
                className={`bottom-resize-handle ${
                    (resizeType === "bottom" ||
                        resizeType === "bottom-right") &&
                    "active"
                }`}
                onMouseDown={(e) => handleResize(e, "bottom")}
            ></div>
            <div
                className="top-right-resize-handle"
                onMouseDown={(e) => handleResize(e, "top-right")}
            ></div>
            <div
                className="top-left-resize-handle"
                onMouseDown={(e) => handleResize(e, "top-left")}
            ></div>
            <div
                className="bottom-right-resize-handle"
                onMouseDown={(e) => handleResize(e, "bottom-right")}
            ></div>
            <div
                className="bottom-left-resize-handle"
                onMouseDown={(e) => handleResize(e, "bottom-left")}
            ></div>
        </div>
    );
};
