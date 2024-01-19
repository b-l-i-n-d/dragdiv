import { useState } from "react";

import { DragWindow } from "./components/drag-window";
import { MainWindow } from "./components/main-window";

import "./App.scss";

function App() {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    return (
        <MainWindow className={`${isDragging && "dragging"}`}>
            <DragWindow isDragging={isDragging} setIsDragging={setIsDragging} />
        </MainWindow>
    );
}

export default App;
