import { useState } from "react";
<<<<<<< HEAD

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
=======
import "./ClaimForm.css";

function ClaimForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }
  //if form is closed , show claim button
    if(!isOpen){
        return (
            <section className="claim-section">
                <button onClick={() => setIsOpen(true)}>
                    Claim This Item
                </button>
            </section>
        )
    }
    //if claim is submitted show this message
    if (submitted) {
        return (
            <section className="claim-section claim-success">
            <h2>Claim Submitted</h2>
            <p>
                Your claim has been submitted for review by the person
                who reported the item.
            </p>
            </section>
        );
    }

        return (
        <section className="claim-section">
            <h2>Claim This Item</h2>

            <p>
            Provide information that can help the finder verify that
            this item belongs to you. These details will not be displayed
            publicly.
            </p>

            <form className="claim-form" onSubmit={handleSubmit}>
            <div className="claim-field">
                <label htmlFor="claimantName">Your Name</label>
                <input
                type="text"
                id="claimantName"
                name="claimantName"
                required
                />
            </div>

            <div className="claim-field">
                <label htmlFor="contact">Contact Information</label>
                <input
                type="text"
                id="contact"
                name="contact"
                placeholder="Email or phone number"
                required
                />
            </div>

            <div className="claim-field">
                <label htmlFor="verification">
                Ownership Verification Details
                </label>
                <textarea
                id="verification"
                name="verification"
                placeholder="Describe something about the item that was not included in the public report."
                required
                />
            </div>
            <div className="claim-actions">
            <button type="submit">Submit Claim</button>

            <button
                type="button"
                onClick={() => setIsOpen(false)}
            >
                Cancel
            </button>
            </div>
            </form>
        </section>
        );
    }
export default ClaimForm;
>>>>>>> upstream/main
