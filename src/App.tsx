import { DragDiv } from "./components/darg-div";
import { DragWindow } from "./components/drag-window";
import { MainWindow } from "./components/main-window";

import "./App.scss";
import { Tooltip } from "./components/tooltip/tooltip";

function App() {
    return (
        <MainWindow>
            <DragWindow>
                <Tooltip direction="top" content="This is a tooltip">
                    <DragDiv />
                </Tooltip>
            </DragWindow>
        </MainWindow>
    );
}

export default App;
