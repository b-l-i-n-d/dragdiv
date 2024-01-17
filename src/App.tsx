import { MouseEvent, useState } from "react";

import { DragDiv } from "./components/darg-div";
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
    const tooltipDivSize = {
        width: 0,
        height: 0,
    };
    const startPosition: IPosition = { x: 0, y: 0 };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        tooltipDivSize.width = e.currentTarget.getBoundingClientRect().width;
        tooltipDivSize.height = e.currentTarget.getBoundingClientRect().height;

        setIsDragging(true);

        startPosition.x = e.clientX - position.x;
        startPosition.y = e.clientY - position.y;

        // @ts-expect-error -- pass event on function
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - startPosition.x;
        const newY = e.clientY - startPosition.y;

        const parentRect = document
            .getElementById("drag-window")
            ?.getBoundingClientRect();
        const maxX = parentRect && parentRect.width - tooltipDivSize.width - 4;
        const maxY =
            parentRect && parentRect.height - tooltipDivSize.height - 4;

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

    return (
        <MainWindow>
            <DragWindow isDragging={isDragging}>
                <DragDiv
                    position={position}
                    isDragging={isDragging}
                    onMouseDown={handleMouseDown}
                />
            </DragWindow>
        </MainWindow>
    );
}

export default App;
