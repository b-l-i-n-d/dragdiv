import { Tooltip } from "./tooltip/tooltip";

interface IDragDivProps {
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    position: {
        x: number;
        y: number;
    };
}

export const DragDiv = ({
    onMouseDown,
    isDragging,
    position,
}: IDragDivProps) => {
    return (
        <div
            style={{
                top: position.y,
                left: position.x,
                position: "absolute",
                cursor: "grab",
            }}
            onMouseDown={(e) => onMouseDown(e)}
        >
            <Tooltip direction="top" content="This is a tooltip">
                <div className={`drag-div ${isDragging && "dragging"}`}>
                    Drag
                </div>
            </Tooltip>
        </div>
    );
};
