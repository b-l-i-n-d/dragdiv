import { useEffect, useState } from "react";

interface IResize {
    resizeDivId: string;
    parentDivId: string;
}

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

export const useResize = ({ resizeDivId, parentDivId }: IResize) => {
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [resizeType, setResizeType] = useState<TResizeType | null>(null);
    const [position, setPosition] = useState<IPosition>({
        x: 0,
        y: 0,
    });
    const [size, setSize] = useState<ISize>({ width: 200, height: 200 });

    const handleResize = (e: React.MouseEvent, type: TResizeType) => {
        e.preventDefault();
        e.stopPropagation();

        setIsResizing(true);
        const currentPositon = {
            x:
                document.getElementById(resizeDivId)?.getBoundingClientRect()
                    .x || 0,
            y:
                document.getElementById(resizeDivId)?.getBoundingClientRect()
                    .y || 0,
        };

        const startSize = size;
        const startPosition = {
            x: e.pageX,
            y: e.pageY,
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            const parentRect = document
                .getElementById(parentDivId)
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
                        x: currentPositon.x,
                        y: currentPositon.y + deltaY,
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
                        x: currentPositon.x + deltaX,
                        y: currentPositon.y + deltaY,
                    });
                    return;
                case "top-right":
                    setSize({
                        width: boundedWidth,
                        height: startSize.height - deltaY,
                    });
                    setPosition({
                        x: currentPositon.x,
                        y: currentPositon.y + deltaY,
                    });
                    return;
                case "bottom-left":
                    setSize({
                        width: startSize.width - deltaX,
                        height: boundedHeight,
                    });
                    setPosition({
                        x: currentPositon.x + deltaX,
                        y: currentPositon.y,
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
            setIsResizing(false);

            // @ts-expect-error -- pass event on function
            document.body.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseup", handleMouseUp);
            setResizeType(null);
        };

        // @ts-expect-error -- pass event on function
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
        setSize({
            width:
                document.getElementById(resizeDivId)?.getBoundingClientRect()
                    .width || 0,
            height:
                document.getElementById(resizeDivId)?.getBoundingClientRect()
                    .height || 0,
        });
    }, [resizeDivId]);

    return {
        isResizing,
        resizeType,
        position,
        size,
        handleResize,
    };
};
