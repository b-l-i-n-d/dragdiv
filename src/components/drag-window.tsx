import { useEffect, useRef, useState } from "react";

import { TResizeType, useResize } from "../hooks/use-resize";
import { throttle } from "../utils/throttle";
import { DragDiv } from "./drag-div";
import { Icons } from "./icons";

interface IPosition {
    x: number;
    y: number;
    left?: number;
    top?: number;
}

interface IDragWindowProps {
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
}

export const DragWindow = ({ isDragging, setIsDragging }: IDragWindowProps) => {
    const parentRect = document
        .getElementById("main-window")
        ?.getBoundingClientRect();

    const [innerDivPosition, setInnerDivPosition] = useState<IPosition>({
        x: 0,
        y: 0,
    });

    const dragWindowRef = useRef<HTMLDivElement>(null);
    const dragDivRef = useRef<HTMLDivElement>(null);
    const [isInnerDivDragging, setIsInnerDivDragging] =
        useState<boolean>(false);
    const [position, setPosition] = useState<IPosition>({ x: 0, y: 0 });
    const innerDivRect = dragDivRef?.current?.getBoundingClientRect();
    const { handleResize, resizeType } = useResize({
        resizeDivId: "drag-window",
        resizeDivRef: dragWindowRef,
        options: {
            minWidth: innerDivRect && innerDivRect.width,
            minHeight: innerDivRect && innerDivRect.height,
            maxHeight: parentRect?.height,
            maxWidth: parentRect?.width,
        },
    });

    const startPosition: IPosition = { x: 0, y: 0 };

    const handleDrag = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const dragWindowRect = dragWindowRef?.current?.getBoundingClientRect();

        setIsDragging(true);

        startPosition.x = dragWindowRect!.x;
        startPosition.y = dragWindowRect!.y;

        const handleMouseMove = throttle((e: React.MouseEvent) => {
            const parentRect = document
                .getElementById("main-window")
                ?.getBoundingClientRect();
            const dragWindowRect =
                dragWindowRef.current?.getBoundingClientRect();

            const newX = e.pageX - dragWindowRect!.width + 20;
            const newY = e.pageY - 20;

            const maxX = parentRect && parentRect.width - dragWindowRect!.width;
            const maxY =
                parentRect && parentRect.height - dragWindowRect!.height;

            const boundedX = Math.min(Math.max(newX, 0), maxX ? maxX : 0);
            const boundedY = Math.min(Math.max(newY, 0), maxY ? maxY : 0);

            setPosition({ x: boundedX, y: boundedY });
        }, 10);

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

        const prevDragDivRect = dragDivRef.current?.getBoundingClientRect();
        const prevDragWindowRect =
            dragWindowRef?.current?.getBoundingClientRect();

        const startPosition: IPosition = {
            x: prevDragDivRect!.x,
            y: prevDragDivRect!.y,
        };

        const getInnerDivBoundedPosition = (width: number, height: number) => {
            const parentRect = dragWindowRef?.current?.getBoundingClientRect();

            const maxX =
                (parentRect &&
                    parentRect.right -
                        parentRect.left -
                        prevDragDivRect!.width) ||
                0;
            const maxY =
                (parentRect &&
                    parentRect.bottom -
                        parentRect.top -
                        prevDragDivRect!.height) ||
                0;

            const boundedX = Math.min(Math.max(width, 0), maxX);
            const boundedY = Math.min(Math.max(height, 0), maxY);

            return { x: boundedX, y: boundedY };
        };

        const pageXGap = prevDragWindowRect!.x - e.pageX;
        const pageYGap = prevDragWindowRect!.y - e.pageY;

        const handleMouseMove = throttle((e: React.MouseEvent) => {
            const dragWindowRect =
                dragWindowRef?.current?.getBoundingClientRect();
            const dragDivRect = dragDivRef.current?.getBoundingClientRect();

            switch (type) {
                case "right": {
                    if (e.pageX > dragDivRect!.right) {
                        return;
                    }
                    if (e.pageX < dragWindowRect!.left) {
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: 0,
                        }));
                        return;
                    }
                    if (dragWindowRect!.x <= e.pageX - dragDivRect!.width) {
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: getInnerDivBoundedPosition(
                                e.pageX -
                                    dragWindowRect!.x -
                                    dragDivRect!.width,
                                prev.y
                            ).x,
                        }));
                    }
                    break;
                }
                case "bottom": {
                    if (e.pageY > dragDivRect!.bottom) {
                        return;
                    }

                    if (e.pageY < dragWindowRect!.top) {
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: 0,
                        }));
                        return;
                    }

                    if (dragWindowRect!.y <= e.pageY - dragDivRect!.height) {
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: getInnerDivBoundedPosition(
                                prev.x,
                                e.pageY -
                                    dragWindowRect!.y -
                                    dragDivRect!.height
                            ).y,
                        }));
                    }
                    break;
                }
                case "bottom-right": {
                    if (dragWindowRect!.right <= dragDivRect!.right) {
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: getInnerDivBoundedPosition(
                                e.pageX -
                                    dragWindowRect!.x -
                                    dragDivRect!.width,
                                prev.y
                            ).x,
                        }));
                    }
                    if (dragWindowRect!.bottom <= dragDivRect!.bottom) {
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: getInnerDivBoundedPosition(
                                prev.x,
                                e.pageY -
                                    dragWindowRect!.y -
                                    dragDivRect!.height
                            ).y,
                        }));
                    }
                    break;
                }
                case "left": {
                    if (e.pageX + pageXGap > dragDivRect!.x) {
                        const newX = startPosition.x - e.pageX - pageXGap;
                        startPosition.x -= newX;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: 0,
                        }));

                        return;
                    }

                    if (
                        e.pageX + pageXGap < dragDivRect!.x &&
                        dragDivRect!.right >= dragWindowRect!.right
                    ) {
                        startPosition.x = dragDivRect!.x;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x:
                                dragWindowRect!.right -
                                dragDivRect!.width -
                                e.pageX -
                                pageXGap,
                        }));
                        return;
                    } else {
                        const newX = startPosition!.x - e.pageX - pageXGap;

                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: Math.max(newX, 0) || 0,
                        }));

                        // return;
                    }
                    break;
                }
                case "top": {
                    if (e.pageY + pageYGap > dragDivRect!.y) {
                        const newY = startPosition!.y - e.pageY - pageYGap;
                        startPosition.y -= newY;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: 0,
                        }));

                        return;
                    }

                    if (
                        e.pageY + pageYGap < dragDivRect!.y &&
                        dragDivRect!.bottom >= dragWindowRect!.bottom
                    ) {
                        startPosition.y = dragDivRect!.y;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y:
                                dragWindowRect!.bottom -
                                dragDivRect!.height -
                                e.pageY -
                                pageYGap,
                        }));
                        return;
                    } else {
                        const newY = startPosition!.y - e.pageY - pageYGap;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: Math.max(newY, 0) || 0,
                        }));

                        // return;
                    }
                    break;
                }
                case "top-left": {
                    if (e.pageX + pageXGap > dragDivRect!.x) {
                        const newX = startPosition.x - e.pageX - pageXGap;
                        startPosition.x -= newX;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: 0,
                        }));

                        // return;
                    } else if (
                        e.pageX + pageXGap < dragDivRect!.x &&
                        dragDivRect!.right >= dragWindowRect!.right
                    ) {
                        startPosition.x = dragDivRect!.x;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x:
                                dragWindowRect!.right -
                                dragDivRect!.width -
                                e.pageX -
                                pageXGap,
                        }));
                        // return;
                    } else {
                        const newX = startPosition!.x - e.pageX - pageXGap;

                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: Math.max(newX, 0) || 0,
                        }));

                        // return;
                    }

                    if (e.pageY + pageYGap > dragDivRect!.y) {
                        const newY = startPosition!.y - e.pageY - pageYGap;
                        startPosition.y -= newY;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: 0,
                        }));

                        // return;
                    } else if (
                        e.pageY + pageYGap < dragDivRect!.y &&
                        dragDivRect!.bottom >= dragWindowRect!.bottom
                    ) {
                        startPosition.y = dragDivRect!.y;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y:
                                dragWindowRect!.bottom -
                                dragDivRect!.height -
                                e.pageY -
                                pageYGap,
                        }));
                        // return;
                    } else {
                        const newY = startPosition!.y - e.pageY - pageYGap;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: Math.max(newY, 0) || 0,
                        }));

                        // return;
                    }
                    break;
                }
                case "top-right": {
                    if (e.pageY + pageYGap > dragDivRect!.y) {
                        const newY = startPosition!.y - e.pageY - pageYGap;
                        startPosition.y -= newY;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: 0,
                        }));
                    } else if (
                        e.pageY + pageYGap < dragDivRect!.y &&
                        dragDivRect!.bottom >= dragWindowRect!.bottom
                    ) {
                        startPosition.y = dragDivRect!.y;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y:
                                dragWindowRect!.bottom -
                                dragDivRect!.height -
                                e.pageY -
                                pageYGap,
                        }));
                    } else {
                        const newY = startPosition!.y - e.pageY - pageYGap;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: Math.max(newY, 0) || 0,
                        }));

                        // return;
                    }

                    if (e.pageX > dragDivRect!.right) {
                        return;
                    } else if (e.pageX < dragWindowRect!.left) {
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: 0,
                        }));
                        // return;
                    } else if (
                        dragWindowRect!.x <=
                        e.pageX - dragDivRect!.width
                    ) {
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: getInnerDivBoundedPosition(
                                e.pageX -
                                    dragWindowRect!.x -
                                    dragDivRect!.width,
                                prev.y
                            ).x,
                        }));
                    }
                    break;
                }
                case "bottom-left": {
                    if (e.pageY > dragDivRect!.bottom) {
                        // return;
                    } else if (e.pageY < dragWindowRect!.top) {
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: 0,
                        }));
                    } else if (
                        dragWindowRect!.y <=
                        e.pageY - dragDivRect!.height
                    ) {
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            y: getInnerDivBoundedPosition(
                                prev.x,
                                e.pageY -
                                    dragWindowRect!.y -
                                    dragDivRect!.height
                            ).y,
                        }));
                    }

                    if (e.pageX + pageXGap > dragDivRect!.x) {
                        const newX = startPosition.x - e.pageX - pageXGap;
                        startPosition.x -= newX;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: 0,
                        }));
                    } else if (
                        e.pageX + pageXGap < dragDivRect!.x &&
                        dragDivRect!.right >= dragWindowRect!.right
                    ) {
                        startPosition.x = dragDivRect!.x;
                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x:
                                dragWindowRect!.right -
                                dragDivRect!.width -
                                e.pageX -
                                pageXGap,
                        }));
                    } else {
                        const newX = startPosition!.x - e.pageX - pageXGap;

                        setInnerDivPosition((prev) => ({
                            ...prev,
                            x: Math.max(newX, 0) || 0,
                        }));
                    }
                    break;
                }
            }
        }, 10);

        const handleMouseUp = () => {
            // @ts-expect-error -- pass event on function
            document.body.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseup", handleMouseUp);
        };

        // @ts-expect-error -- pass event on function
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {}, [dragWindowRef, dragDivRef]);

    return (
        <div
            id="drag-window"
            ref={dragWindowRef}
            className={`drag-window ${
                (isInnerDivDragging || isDragging) && "dragging"
            }`}
            style={{
                top: position.y,
                left: position.x,
            }}
        >
            <DragDiv
                dragDivRef={dragDivRef}
                position={innerDivPosition}
                setPosition={setInnerDivPosition}
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
                onMouseDown={(e) => handleDivResize(e, "top-right")}
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
