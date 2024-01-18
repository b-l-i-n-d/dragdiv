interface MainWindowProps {
    children?: React.ReactNode;
    className?: string;
}

export const MainWindow = ({ children, className }: MainWindowProps) => {
    return (
        <div id="main-window" className={`main-window ${className}`}>
            {children}
        </div>
    );
};
