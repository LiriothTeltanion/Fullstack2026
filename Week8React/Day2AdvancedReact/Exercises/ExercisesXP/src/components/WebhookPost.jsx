import { useState } from "react";

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

function WebhookPost() {
  const [status, setStatus] = useState("");

  const sendData = async () => {
    if (!WEBHOOK_URL) {
      setStatus("Add VITE_WEBHOOK_URL to a .env file first.");
      return;
    }
    const body = { key1: "myusername", email: "mymail@gmail.com", name: "Isaac" };
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
      setStatus(`Sent. Status ${response.status}. Check webhook.site.`);
    } catch (error) {
      setStatus(`Request failed: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={sendData}>Press me to post some data</button>
      {status && <p className="muted">{status}</p>}
    </div>
  );
}

export default WebhookPost;
