import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { socket } from "../socket";

import {
  getMessages,
  sendMessage,
} from "../api/message.api";

type Message = {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
  };
};

export default function Conversation() {
  const { id } = useParams();

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [content, setContent] =
    useState("");

  const loadMessages =
    async () => {
      if (!id) return;

      try {
        const res =
          await getMessages(id);

        setMessages(res.messages);
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    loadMessages();
  }, [id]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    socket.emit(
      "join_room",
      id
    );
  }, [id]);

  useEffect(() => {
    socket.on(
      "receive_message",
      (message) => {
        setMessages(
          (prev) => [
            ...prev,
            message,
          ]
        );
      }
    );

    return () => {
      socket.off(
        "receive_message"
      );
    };
  }, []);

  const handleSend =
    async () => {
      if (!id || !content.trim()) {
        return;
      }

      try {
        await sendMessage(
          id,
          content
        );

        setContent("");
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      <h2>Conversation</h2>

      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>
              {message.sender.username}
            </strong>

            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <input
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        placeholder="Type a message"
      />

      <button onClick={handleSend}>
        Send
      </button>
    </div>
  );
}