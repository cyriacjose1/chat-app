import { useParams } from "react-router-dom";

export default function Conversation() {
  const { id } = useParams();

  return (
    <div>
      <h2>
        Conversation
      </h2>

      <p>ID: {id}</p>
    </div>
  );
}