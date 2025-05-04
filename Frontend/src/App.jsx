import React, { useEffect } from "react";

import Chat from "./chat";
import RoomTest from "./socketTest/roomTest";
import RoomJoinTest from "./socketTest/roomJoinTest";
import GameQuizTest from "./socketTest/gameQuizTest";

function App() {
  return (
    <div className="App">
      <RoomTest/>
      <RoomJoinTest/>
      <GameQuizTest/>
    </div>
  );
}

export default App;
