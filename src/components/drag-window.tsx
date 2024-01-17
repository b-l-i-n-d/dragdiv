interface DragWindowProps {
    children?: React.ReactNode;
}

export const DragWindow = ({ children }: DragWindowProps) => {
    return <div className="drag-window">{children}</div>;
};
