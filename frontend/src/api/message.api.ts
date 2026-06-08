import { api } from "../lib/api";

export const getMessages = async (
  conversationId: string
) => {
  const res = await api.get(
    `/messages/conversation/${conversationId}`
  );

  return res.data;
};

export const sendMessage = async (
  conversationId: string,
  content: string
) => {
  const res = await api.post(
    "/messages",
    {
      conversationId,
      content,
    }
  );

  return res.data;
};