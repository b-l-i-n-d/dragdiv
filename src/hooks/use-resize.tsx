import { useEffect, useState } from "react";

interface IResizeProps {
    resizeDivId: string;
    options?: {
        minWidth?: number;
        minHeight?: number;
        maxWidth?: number;
        maxHeight?: number;
    };
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

export const useResize = ({ resizeDivId, options }: IResizeProps) => {
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [resizeType, setResizeType] = useState<TResizeType | null>(null);
    const [position, setPosition] = useState<IPosition>({
        x: 0,
        y: 0,
    });
    const [size, setSize] = useState<ISize>({ width: 0, height: 0 });

    const handleResize = (e: React.MouseEvent, type: TResizeType) => {
        e.preventDefault();
        e.stopPropagation();

        setIsResizing(true);

        const resizeDivRect = document
            .getElementById(resizeDivId)
            ?.getBoundingClientRect();
        const maxSize = {
            width: options?.maxWidth || window.innerWidth,
            height: options?.maxHeight || window.innerHeight,
        };
        const minSize = {
            width: options?.minWidth || 0,
            height: options?.minHeight || 0,
        };

        const getBoundedSize = (width: number, height: number) => {
            const boundedWidth = Math.min(
                Math.max(width, minSize.width),
                maxSize.width
            );
            const boundedHeight = Math.min(
                Math.max(height, minSize.height),
                maxSize.height
            );

            return {
                width: boundedWidth,
                height: boundedHeight,
            };
        };

        const currentPositon: IPosition = {
            x: resizeDivRect?.x || 0,
            y: resizeDivRect?.y || 0,
        };

        const startSize: ISize = {
            width: resizeDivRect?.width || 0,
            height: resizeDivRect?.height || 0,
        };
        const startPosition = {
            x: e.pageX,
            y: e.pageY,
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            const deltaX = e.pageX - startPosition.x;
            const deltaY = e.pageY - startPosition.y;

            setResizeType(type);

            switch (type) {
                case "top":
                    setSize(
                        getBoundedSize(
                            startSize.width,
                            startSize.height - deltaY
                        )
                    );
                    if (minSize.height > startSize.height - deltaY) {
                        return;
                    }
                    setPosition({
                        x: currentPositon.x,
                        y: currentPositon.y + deltaY,
                    });
                    return;
                case "bottom":
                    setSize(
                        getBoundedSize(
                            startSize.width,
                            startSize.height + deltaY
                        )
                    );
                    return;
                case "left":
                    setSize(
                        getBoundedSize(
                            startSize.width - deltaX,
                            startSize.height
                        )
                    );
                    if (minSize.width > startSize.width - deltaX) {
                        return;
                    }
                    setPosition({
                        x: currentPositon.x + deltaX,
                        y: currentPositon.y,
                    });
                    return;
                case "right":
                    setSize(
                        getBoundedSize(
                            startSize.width + deltaX,
                            startSize.height
                        )
                    );
                    return;
                case "top-left":
                    setSize(
                        getBoundedSize(
                            startSize.width - deltaX,
                            startSize.height - deltaY
                        )
                    );
                    if (
                        minSize.width > startSize.width - deltaX &&
                        minSize.height <= startSize.height - deltaY
                    ) {
                        setPosition((prev) => ({
                            x: prev.x,
                            y: currentPositon.y + deltaY,
                        }));
                        return;
                    }
                    if (
                        minSize.height > startSize.height - deltaY &&
                        minSize.width <= startSize.width - deltaX
                    ) {
                        setPosition((prev) => ({
                            x: currentPositon.x + deltaX,
                            y: prev.y,
                        }));
                        return;
                    }
                    if (
                        minSize.height > startSize.height - deltaY &&
                        minSize.width > startSize.width - deltaX
                    ) {
                        return;
                    }

                    setPosition({
                        x: currentPositon.x + deltaX,
                        y: currentPositon.y + deltaY,
                    });
                    return;
                case "top-right":
                    setSize(
                        getBoundedSize(
                            startSize.width + deltaX,
                            startSize.height - deltaY
                        )
                    );
                    if (
                        minSize.width > startSize.width + deltaX &&
                        minSize.height <= startSize.height - deltaY
                    ) {
                        setPosition((prev) => ({
                            x: prev.x,
                            y: currentPositon.y + deltaY,
                        }));
                        return;
                    }
                    if (
                        minSize.height > startSize.height - deltaY &&
                        minSize.width <= startSize.width + deltaX
                    ) {
                        setPosition((prev) => ({
                            x: currentPositon.x,
                            y: prev.y,
                        }));
                        return;
                    }
                    if (
                        minSize.height > startSize.height - deltaY &&
                        minSize.width > startSize.width + deltaX
                    ) {
                        return;
                    }
                    setPosition({
                        x: currentPositon.x,
                        y: currentPositon.y + deltaY,
                    });
                    return;
                case "bottom-left":
                    setSize(
                        getBoundedSize(
                            startSize.width - deltaX,
                            startSize.height + deltaY
                        )
                    );
                    if (
                        minSize.width > startSize.width - deltaX &&
                        minSize.height <= startSize.height + deltaY
                    ) {
                        setPosition((prev) => ({
                            x: prev.x,
                            y: currentPositon.y,
                        }));
                        return;
                    }
                    if (
                        minSize.height > startSize.height + deltaY &&
                        minSize.width <= startSize.width - deltaX
                    ) {
                        setPosition((prev) => ({
                            x: currentPositon.x + deltaX,
                            y: prev.y,
                        }));
                        return;
                    }
                    if (
                        minSize.height > startSize.height + deltaY &&
                        minSize.width > startSize.width - deltaX
                    ) {
                        return;
                    }
                    setPosition({
                        x: currentPositon.x + deltaX,
                        y: currentPositon.y,
                    });
                    return;
                case "bottom-right":
                    setSize(
                        getBoundedSize(
                            startSize.width + deltaX,
                            startSize.height + deltaY
                        )
                    );
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
        const resizeDiv = document.getElementById(resizeDivId);

        if (resizeDiv && isResizing) {
            resizeDiv.style.left = `${position.x}px`;
            resizeDiv.style.top = `${position.y}px`;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    useEffect(() => {
        const resizeDiv = document.getElementById(resizeDivId);

        if (resizeDiv && isResizing) {
            resizeDiv.style.width = `${size.width}px`;
            resizeDiv.style.height = `${size.height}px`;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size]);

    return {
        isResizing,
        resizeType,
        handleResize,
        size,
        position,
    };
};
