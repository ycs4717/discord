import "./Chat.scss";
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GifIcon from "@mui/icons-material/Gif";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ChatMessage from "./ChatMessage";
import { useAppSelector } from "../../app/hooks";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import useSubCollection from "../../hooks/useSubCollection";

const Chat = () => {
  const [inputText, setInputText] = useState<string>("");
  const channelName = useAppSelector((state) => state.channel.channelName);
  const channelId = useAppSelector((state) => state.channel.channelId);
  const user = useAppSelector((state) => state.user.user);
  const { subDocuments: messages } = useSubCollection("channels", "messages");
  const chatMessageRef = useRef<HTMLDivElement | null>(null);

  //여기서부터 수정
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 에러 메시지 상태 추가
  //수정 끝

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 입력 값이 비어 있는지 확인
    if (!inputText.trim()) {
      window.alert("뭐라도 입력해요");
      return;
    }

    const collectionRef: CollectionReference<DocumentData> = collection(
      db,
      "channels",
      String(channelId),
      "messages"
    );
    const docRef: DocumentReference<DocumentData> = await addDoc(
      collectionRef,
      {
        message: inputText,
        timestamp: serverTimestamp(),
        user: user,
      }
    );
    setInputText("");
  };
  useEffect(() => {
    if (chatMessageRef.current) {
      chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat">
      <ChatHeader channelName={channelName} />
      <div className="chatMessage" ref={chatMessageRef}>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.message}
            timestamp={message.timestamp}
            user={message.user}
          />
        ))}
      </div>

      <div className="chatInput">
        <AddCircleOutlineIcon />
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="メッセージを入力"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputText(e.target.value)
            }
            value={inputText}
          />
          {/* 에러 메시지 표시 */}
          {errorMessage && <div className="errorMessage">{errorMessage}</div>}

          <button type="submit" className="chatInputButton">
            送信
          </button>
        </form>
        <div className="chatInputIcons">
          <CardGiftcardIcon />
          <GifIcon />
          <EmojiEmotionsIcon />
        </div>
      </div>
    </div>
  );
};

export default Chat;
