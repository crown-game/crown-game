// Chat.js
import React, { useEffect, useState, useRef } from "react";
import socket from "../socket"; // socket.io-client 인스턴스

function Chat({ roomId, userId }) {
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    socket.on("chat_message", ({ userId, message }) => {
      setChatLog((prev) => [...prev, { userId, message }]);
    });

    return () => {
      socket.off("chat_message");
    };
  }, []);

  useEffect(() => {
    // 자동 스크롤
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatLog]);

  const sendChatMessage = () => {
    if (chatInput.trim() === "") return;

    socket.emit("chat_message", {
      roomId,
      userId,
      message: chatInput,
    });

    setChatInput("");
  };

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px solid gray", paddingTop: "1rem" }}>
      <h4>💬 채팅</h4>
      <div
        ref={chatBoxRef}
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "0.5rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        {chatLog.map((msg, i) => (
          <div key={i}>
            <strong>{msg.userId}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
        placeholder="메시지를 입력하세요"
        style={{ width: "80%", marginRight: "5px" }}
      />
      <button onClick={sendChatMessage}>전송</button>
    </div>
  );
}

export default Chat;
