import { api } from "../lib/api";

export const createConversation = async (
  userId: string
) => {
  const res = await api.post(
    "/conversations",
    {
      userId,
    }
  );

  return res.data;
};

export const getConversations =
  async () => {
    const res = await api.get(
      "/conversations"
    );

    return res.data;
};