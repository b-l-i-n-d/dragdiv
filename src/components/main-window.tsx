interface MainWindowProps {
    children?: React.ReactNode;
}

export const MainWindow = ({ children }: MainWindowProps) => {
    return <div className="main-window">{children}</div>;
};
