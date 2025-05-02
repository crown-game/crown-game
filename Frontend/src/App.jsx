import React, { useEffect } from "react";

import Chat from "./chat";
import RoomTest from "./socketTest/roomTest";
import RoomJoinTest from "./socketTest/roomJoinTest";

function App() {
  return (
    <div className="App">
      <RoomTest/>
      <RoomJoinTest/>
    </div>
  );
}

export default App;
