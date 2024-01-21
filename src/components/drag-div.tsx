import { MouseEvent, useState } from "react";
import { Tooltip } from "./tooltip/tooltip";

interface IPosition {
    x: number;
    y: number;
}

interface IDragDivProps {
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
}

export const DragDiv = ({ isDragging, setIsDragging }: IDragDivProps) => {
    const [position, setPosition] = useState<IPosition>({ x: 0, y: 0 });
    const tooltipDivSize = {
        width: 0,
        height: 0,
    };
    const startPosition: IPosition = { x: 0, y: 0 };

    const handleDrag = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        tooltipDivSize.width = e.currentTarget.getBoundingClientRect().width;
        tooltipDivSize.height = e.currentTarget.getBoundingClientRect().height;

        setIsDragging(true);

        startPosition.x = e.pageX - position.x;
        startPosition.y = e.pageY - position.y;

        const handleMouseMove = (e: MouseEvent) => {
            const newX = e.pageX - startPosition.x;
            const newY = e.pageY - startPosition.y;

            const parentRect = document
                .getElementById("drag-window")
                ?.getBoundingClientRect();
            const maxX =
                parentRect && parentRect.width - tooltipDivSize.width - 4;
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

        // @ts-expect-error -- pass event on function
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div
            id="drag-div"
            style={{
                top: position.y,
                left: position.x,
                position: "absolute",
                cursor: "grab",
            }}
            onMouseDown={(e) => handleDrag(e)}
        >
            <Tooltip direction="top" content="This is a tooltip">
                <div className={`drag-div ${isDragging && "dragging"}`}>
                    Drag
                </div>
            </Tooltip>
        </div>
    );
};
