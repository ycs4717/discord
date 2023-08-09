import React from "react";
import "./ChatMessage.scss";
import { Avatar } from "@mui/material";
const ChatMessage = () => {
  return (
    <div className="message">
      <Avatar />
      <div className="messageInfo">
        <h4>
          ユーザー名
          <span className="messageTimestamp">2021/10/20 </span>
        </h4>
        <p>メッセージ</p>
      </div>
    </div>
  );
};

export default ChatMessage;
