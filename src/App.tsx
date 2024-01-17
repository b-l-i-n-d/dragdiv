import { DragDiv } from "./components/darg-div";
import { DragWindow } from "./components/drag-window";
import { MainWindow } from "./components/main-window";

import "./App.css";

function App() {
    return (
        <MainWindow>
            <DragWindow>
                <DragDiv />
            </DragWindow>
        </MainWindow>
    );
}

export default App;
