interface DragWindowProps {
    children?: React.ReactNode;
}

export const DragWindow = ({ children }: DragWindowProps) => {
    return (
        <div id="drag-window" className="drag-window">
            {children}
        </div>
    );
};
