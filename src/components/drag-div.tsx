import { useEffect } from "react";
import { throttle } from "../utils/throttle";
import { Tooltip } from "./tooltip/tooltip";

interface IPosition {
    x: number;
    y: number;
}

interface IDragDivProps {
    dragDivRef: React.RefObject<HTMLDivElement>;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    position: IPosition;
    setPosition: (position: IPosition) => void;
}

export const DragDiv = ({
    dragDivRef,
    isDragging,
    setIsDragging,
    position,
    setPosition,
}: IDragDivProps) => {
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
        // console.log(
        //     startPosition,
        //     e.pageX,
        //     position,
        //     e.currentTarget.getBoundingClientRect().x
        // );

        const handleMouseMove = throttle((e: React.MouseEvent) => {
            const newX = e.pageX - startPosition.x;
            const newY = e.pageY - startPosition.y;

            const parentRect = document
                .getElementById("drag-window")
                ?.getBoundingClientRect();
            const maxX = parentRect && parentRect.width - tooltipDivSize.width;
            const maxY =
                parentRect && parentRect.height - tooltipDivSize.height;

            const boundedX = Math.min(Math.max(newX, 0), maxX ? maxX : 0);
            const boundedY = Math.min(Math.max(newY, 0), maxY ? maxY : 0);

            setPosition({ x: boundedX, y: boundedY });
        }, 10);

        const handleMouseUp = () => {
            setIsDragging(false);
            // @ts-expect-error -- pass event to removeEventListener
            document.body.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseup", handleMouseUp);
        };

        // @ts-expect-error -- pass event to addEventListener
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {}, [dragDivRef]);

    return (
        <div
            ref={dragDivRef}
            id="drag-div"
            style={{
                top: position.y,
                left: position.x,
                width: "80px",
                height: "80px",
                position: "absolute",
                cursor: "grab",
            }}
            onMouseDown={(e) => handleDrag(e)}
        >
            <Tooltip direction="top" content="This is a tooltip">
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    className={`drag-div ${isDragging && "dragging"}`}
                >
                    Drag
                </div>
            </Tooltip>
        </div>
    );
};
