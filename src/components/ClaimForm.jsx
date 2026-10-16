import { useState } from "react";
import "./ClaimForm.css";

const API = "http://localhost:5555";

function ClaimForm({ itemId, onClaimed }) {
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
      if (onClaimed) onClaimed(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <section className="claim-section">
        <button type="button" onClick={() => setIsOpen(true)}>
          Claim This Item
        </button>
      </section>
    );
  }

  return (
    <section className="claim-section">
      <h2>Claim This Item</h2>
      <p>
        Provide information that can help the finder verify that this item
        belongs to you. These details will not be displayed publicly.
      </p>

      <form className="claim-form" onSubmit={handleSubmit}>
        <div className="claim-field">
          <label htmlFor="verification">Ownership Verification Details</label>
          <textarea
            id="verification"
            name="verification"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe something about the item that was not included in the public report."
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="claim-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Claim"}
          </button>
          <button type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default ClaimForm;
