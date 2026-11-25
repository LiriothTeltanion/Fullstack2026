export default function MessageList({ messages, onDelete }) {
  if (messages.length === 0) {
    return <p className="muted">No messages yet. Be the first.</p>;
  }

  return (
    <ul className="messages">
      {messages.map(message => (
        <li key={message.id} className="card">
          <div className="message-head">
            <strong>{message.name}</strong>
            <time dateTime={message.created_at}>
              {new Date(message.created_at).toLocaleString("en-GB")}
            </time>
          </div>
          <p>{message.text}</p>
          <button type="button" className="link" onClick={() => onDelete(message.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
