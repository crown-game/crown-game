import React, { useEffect } from "react";
import socket from "./socket";

import Chat from "./chat";

function App() {
  return (
    <div className="App">
      <Chat />
    </div>
  );
}

export default App;
