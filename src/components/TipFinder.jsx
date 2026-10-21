import { useState } from "react";
import { sendTip, getTipStatus } from "../utils/api";

function TipFinder({ itemId }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(50);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(""); // "", "waiting", "paid", "failed"
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const data = await sendTip(itemId, Number(amount), phone);
      setStatus("waiting");
      setMessage(data.message);
      checkStatus(data.tip.id, 0);
    } catch (err) {
      setMessage(err.message);
    }
  }

  // Ask the backend every 5 seconds (up to 1 minute) whether the payment went through
  function checkStatus(tipId, tries) {
    setTimeout(async () => {
      try {
        const tip = await getTipStatus(tipId);
        if (tip.status === "pending" && tries < 12) return checkStatus(tipId, tries + 1);
        setStatus(tip.status === "pending" ? "failed" : tip.status);
        setMessage(
          tip.status === "paid"
            ? "Tip sent 💚 Thank you for appreciating the finder!"
            : "The payment didn't go through. You can try again."
        );
      } catch {
        if (tries < 12) checkStatus(tipId, tries + 1);
      }
    }, 5000);
  }

  if (!open) {
    return (
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        💚 Tip the finder
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: 360 }}>
      <h3>Say thank you with an M-Pesa tip</h3>
      <label>
        Amount (KSh)
        <input className="input" type="number" min="1" value={amount}
          onChange={(e) => setAmount(e.target.value)} required />
      </label>
      <label>
        Your M-Pesa number
        <input className="input" type="tel" placeholder="0712345678" value={phone}
          onChange={(e) => setPhone(e.target.value)} required />
      </label>
      <button type="submit" className="btn" disabled={status === "waiting"}>
        {status === "waiting" ? "Waiting for your PIN..." : "Send tip"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default TipFinder;