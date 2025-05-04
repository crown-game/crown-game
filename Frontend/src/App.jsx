import React, { useEffect, useState} from "react";

import Chat from "./chat";
import RoomTest from "./socketTest/roomTest";
import RoomJoinTest from "./socketTest/roomJoinTest";
import GameQuizTest from "./socketTest/gameQuizTest";

function App() {
  const [roomInfo, setRoomInfo] = useState({ roomId: null, userId: null });

  return (
    <div className="App">
      <RoomTest/>
      <RoomJoinTest setRoomInfo={setRoomInfo} />
      {roomInfo.roomId && roomInfo.userId && (
        <GameQuizTest roomId={roomInfo.roomId} userId={roomInfo.userId} />
      )}
    </div>
  );
}

export default App;
