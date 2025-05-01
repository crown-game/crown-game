// src/Chat.js
import React, { useState, useEffect } from "react";
import socket from "./socket";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 서버로부터 'chat message' 이벤트를 받으면 메시지 추가
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      socket.off("chat message");
    };
  }, []);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", message);  // 서버로 메시지 전송
      setMessage("");  // 메시지 입력란 비우기
    }
  };

  return (
    <div>
      <h2>채팅방</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}

export default Chat;
