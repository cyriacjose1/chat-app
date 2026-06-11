export function getMessageDateLabel(
  dateString: string
) {
  const date = new Date(dateString);

  const today =
    new Date().toDateString();

  const yesterday =
    new Date(
      Date.now() -
        24 * 60 * 60 * 1000
    ).toDateString();

  if (
    date.toDateString() === today
  ) {
    return "Today";
  }

  if (
    date.toDateString() ===
    yesterday
  ) {
    return "Yesterday";
  }

  return date.toLocaleDateString(
    [],
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export function formatConversationTime(
  dateString: string
) {
  const date = new Date(dateString);

  const now = new Date();

  const today =
    now.toDateString();

  const yesterday =
    new Date(
      now.getTime() -
        24 * 60 * 60 * 1000
    ).toDateString();

  if (
    date.toDateString() === today
  ) {
    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  if (
    date.toDateString() ===
    yesterday
  ) {
    return "Yesterday";
  }

  return date.toLocaleDateString(
    [],
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}