interface DragWindowProps {
    children?: React.ReactNode;
    isDragging?: boolean;
}

export const DragWindow = ({ children, isDragging }: DragWindowProps) => {
    return (
        <div
            id="drag-window"
            className={`drag-window ${isDragging && "dragging"}`}
        >
            {children}
        </div>
    );
};
