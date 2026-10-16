import { useState } from "react";

const API = "http://localhost:5555";

export default function ClaimForm({ itemId, onClaimed }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!message.trim()) {
      setError("Please describe why this item is yours.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/items/${itemId}/claims`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit claim");
      setMessage("");
      onClaimed(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Claim this item</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe identifying details (colour, marks, contents...)"
        rows={4}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit claim"}
      </button>
    </form>
  );
}