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
  // 메시지 입력을 위한 상태
  const [inputText, setInputText] = useState<string>("");

  // 채널 이름, ID, 사용자 정보를 위한 Redux 선택자
  const channelName = useAppSelector((state) => state.channel.channelName);
  const channelId = useAppSelector((state) => state.channel.channelId);
  const user = useAppSelector((state) => state.user.user);

  // 메시지를 가져오기 위한 사용자 정의 훅 사용
  const { subDocuments: messages } = useSubCollection("channels", "messages");

  // 채팅 메시지 컨테이너를 위한 참조
  const chatMessageRef = useRef<HTMLDivElement | null>(null);

  // 메시지를 보내기 위한 함수
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력이 비어 있는지 확인 후, 비어 있으면 알림 표시
    if (!inputText.trim()) {
      window.alert("뭐라도 입력해요");
      return;
    }

    // 메시지를 Firebase에 추가하는 로직
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

    // 메시지 전송 후 입력 필드 초기화
    setInputText("");
  };

  // 최근 메시지로 스크롤 하는 효과
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
