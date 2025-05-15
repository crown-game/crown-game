import React, { useState} from "react";

import RoomTest from "./socketTest/roomTest";
import RoomJoinTest from "./socketTest/roomJoinTest";
import GameQuizTest from "./socketTest/gameQuizTest";
import Chat from "./socketTest/chat";

function App() {
  const [roomInfo, setRoomInfo] = useState({ roomId: null });

  return (
    <div className="App">
      <RoomTest/>
      <RoomJoinTest setRoomInfo={setRoomInfo} />
      {roomInfo.roomId && (
        <>
          <GameQuizTest roomId={roomInfo.roomId} />
          <Chat roomId={roomInfo.roomId} />
        </>
      )}
    </div>
  );
}

export default App;
