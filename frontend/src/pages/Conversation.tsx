import {
  useEffect,
  useState,
  useRef,
} from "react";

import { useParams } from "react-router-dom";

import { socket } from "../socket";

import {
  getMessages,
  sendMessage,
  markAsRead,
} from "../api/message.api";

import { getMessageDateLabel } from "../utils/date";

import { useAuthStore } from "../store/auth.store";

type Message = {
  id: string;
  content: string;
  createdAt: string;

  isRead: boolean;
  readAt: string | null;

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

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const [isTyping, setIsTyping] =
    useState(false);

  const typingTimeout =
    useRef<number | null>(null);

  const currentUser = useAuthStore((state) => state.user);

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
    if (id) {
      markAsRead(id);
    }
  }, [id]);

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
    async (
      message: Message
    ) => {
      setMessages(
        (prev) => [
          ...prev,
          message,
        ]
      );

      if (
        id &&
        message.sender.id !==
          currentUser?.id
      ) {
        try {
          await markAsRead(id);
        } catch (error) {
          console.error(error);
        }
      }
    }
  );

  return () => {
    socket.off(
      "receive_message"
    );
  };
}, [id, currentUser]);

  useEffect(() => {
    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }, [messages]);

  useEffect(() => {
    socket.on(
      "messages_read",
      ({
        messageIds,
      }: {
        messageIds: string[];
      }) => {
        setMessages(
          (prev) =>
            prev.map(
              (message) =>
                messageIds.includes(
                  message.id
                )
                  ? {
                      ...message,
                      isRead: true,
                    }
                  : message
            )
        );
      }
    );

    return () => {
      socket.off(
        "messages_read"
      );
    };
  }, []);

  useEffect(() => {
    socket.on(
      "user_typing",
      () => {
        setIsTyping(true);
      }
    );

    socket.on(
      "user_stop_typing",
      () => {
        setIsTyping(false);
      }
    );

    return () => {
      socket.off(
        "user_typing"
      );
      socket.off(
        "user_stop_typing"
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
        socket.emit(
          "typing_stop",
          id
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      <h2>Conversation</h2>

      <div>
        {messages.map(
          (message, index) => {
            const currentLabel =
              getMessageDateLabel(
                message.createdAt
              );

            const previousLabel =
              index > 0
                ? getMessageDateLabel(
                    messages[
                      index - 1
                    ].createdAt
                  )
                : null;

            const showDateSeparator =
              currentLabel !==
              previousLabel;

            return (
              <div
                key={message.id}
              >
                {showDateSeparator && (
                  <div>
                    <hr />

                    <strong>
                      {
                        currentLabel
                      }
                    </strong>

                    <hr />
                  </div>
                )}

                <div>
                  <strong>
                    {
                      message.sender
                        .username
                    }
                  </strong>

                  <p>
                    {message.content}
                  </p>

                  <small>
                    {new Date(
                      message.createdAt
                    ).toLocaleTimeString(
                      [],
                      {
                        hour:
                          "2-digit",
                        minute:
                          "2-digit",
                      }
                    )}

                    {message.sender.id ===
                      currentUser?.id && (
                      <small>
                        {" "}
                        {message.isRead
                          ? "✓✓"
                          : "✓"}
                      </small>
                    )}
                  </small>
                </div>
              </div>
            );
          }
        )}

        <div ref={messagesEndRef} />
      </div>

      {isTyping && (
        <p>
          Typing...
        </p>
      )}

      <input
        value={content}
        onChange={(e) => {
          setContent(
            e.target.value
          );

          if (id) {
            socket.emit(
              "typing_start",
              id
            );
            if (typingTimeout.current) {
              clearTimeout(
                typingTimeout.current
              );
            }

            typingTimeout.current =
              window.setTimeout(() => {
                socket.emit(
                  "typing_stop",
                  id
                );
              }, 1000);
          }
        }}
        placeholder="Type a message"
      />

      <button onClick={handleSend}>
        Send
      </button>
    </div>
  );
}