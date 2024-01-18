import { MouseEvent, useEffect, useState } from "react";

import { DragWindow } from "./components/drag-window";
import { MainWindow } from "./components/main-window";

import "./App.scss";

interface IPosition {
    x: number;
    y: number;
}

function App() {
    const [position, setPosition] = useState<IPosition>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragWindowSize, setDragWindowSize] = useState<DOMRect | null>(null);
    const startPosition: IPosition = { x: 0, y: 0 };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);

        startPosition.x = dragWindowSize!.x;
        startPosition.y = dragWindowSize!.y;

        // @ts-expect-error -- pass event on function
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const parentRect = document
            .getElementById("main-window")
            ?.getBoundingClientRect();

        const newX = e.clientX - dragWindowSize!.width + 20;
        const newY = e.clientY - 20;

        const maxX = parentRect && parentRect.width - dragWindowSize!.width;
        const maxY = parentRect && parentRect.height - dragWindowSize!.height;

        const boundedX = Math.min(Math.max(newX, 0), maxX ? maxX : 0);
        const boundedY = Math.min(Math.max(newY, 0), maxY ? maxY : 0);

        // console.log(newX, boundedX, newY, boundedY);

        setPosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // @ts-expect-error -- pass event on function
        document.body.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
        const dragWindowRect = document
            .getElementById("drag-window")
            ?.getBoundingClientRect();
        setDragWindowSize(dragWindowRect || null);
    }, [isDragging]);

    return (
        <MainWindow className={`${isDragging && "dragging"}`}>
            <DragWindow
                handleDragWindowMouseDown={handleMouseDown}
                dragWindowPosition={position}
                isDragWindowDragging={isDragging}
            />
        </MainWindow>
    );
}

export default App;
