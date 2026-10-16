import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClaimForm from "../components/ClaimForm";
import PossibleMatches from "../components/PossibleMatches";
import { getItem } from "../utils/api";
import "./ItemDetails.css";

const API = "http://localhost:5555";

function ItemDetails() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadedId, setLoadedId] = useState(null);
  const [error, setError] = useState("");

  const [claims, setClaims] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [claimError, setClaimError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    getItem(id)
      .then((loadedItem) => {
        if (!ignore) {
          setItem(loadedItem);
          setError("");
          setLoadedId(id);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setItem(null);
          setError(err.message);
          setLoadedId(id);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  async function loadClaims() {
    if (!user) {
      setClaims([]);
      setIsOwner(false);
      return;
    }
    const res = await fetch(`${API}/api/items/${id}/claims`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setClaims(data.claims);
      setIsOwner(data.is_owner);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    loadClaims();
  }, [id, user, authLoading]);

  async function decide(claimId, status) {
    setClaimError("");
    const res = await fetch(`${API}/api/claims/${claimId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setClaimError(data.error || "Could not update claim");
      return;
    }
    setItem(data.item);
    loadClaims();
  }

  if (loading || authLoading || loadedId !== id) {
    return <p className="item-details-notfound">Loading item...</p>;
  }

  if (error || !item) {
    return (
      <section className="item-details-notfound">
        <h1>Could not load item</h1>
        <p>{error || `There is no item with ID ${id}.`}</p>
        <Link to="/">Back to all items</Link>
      </section>
    );
  }

  const myClaim = claims.find((c) => c.user_id === user?.id);
  const canClaim =
    user &&
    !isOwner &&
    item.status === "active" &&
    item.reportType === "found" &&
    !myClaim;
  const reporterLabel =
    item.reporterUsername || `User #${item.reportedBy ?? item.user_id}`;

  return (
    <section className="item-details">
      <Link to="/" className="item-details-back">Back to all items</Link>

      <div className="item-details-layout">
        {item.image_url ? (
          <img className="item-details-photo" src={item.image_url} alt={item.title} />
        ) : (
          <div className="item-details-photo item-details-photo--empty">
            No photo provided
          </div>
        )}

        <div className="item-details-info">
          <div className="item-details-badges">
            <span className={`item-badge item-badge--${item.type}`}>{item.type}</span>
            <span className={`item-badge item-badge--${item.status}`}>{item.status}</span>
          </div>

          <h1>{item.title}</h1>
          <p className="item-details-description">{item.description}</p>

          <dl className="item-details-meta">
            <dt>Category</dt>
            <dd>{item.category}</dd>
            <dt>Location</dt>
            <dd>{item.location || "Not specified"}</dd>
            <dt>Date</dt>
            <dd>{item.date || "Not specified"}</dd>
            <dt>Reported by</dt>
            <dd>{reporterLabel}</dd>
          </dl>
        </div>
      </div>

      {item.reportType === "lost" && item.status === "active" && (
        <PossibleMatches itemId={item.id} />
      )}

      <div className="claims-section">
        {claimError && <p className="error">{claimError}</p>}

        {!user && item.reportType === "found" && (
          <p>
            <Link to="/login">Log in</Link> to claim this item.
          </p>
        )}

        {canClaim && <ClaimForm itemId={item.id} onClaimed={loadClaims} />}

        {myClaim && (
          <p>
            Your claim is <strong>{myClaim.status}</strong>.
          </p>
        )}

        {isOwner && (
          <>
            <h2>Claims ({claims.length})</h2>
            {claims.length === 0 && <p>No claims yet.</p>}
            {claims.map((c) => (
              <div key={c.id} className="claim-card">
                <p>
                  <strong>{c.claimant}</strong>{" "}
                  <span className={`claim-status claim-status--${c.status}`}>
                    {c.status}
                  </span>
                </p>
                <p>{c.message}</p>
                {c.status === "pending" && (
                  <div className="claim-actions">
                    <button onClick={() => decide(c.id, "approved")}>Approve</button>
                    <button onClick={() => decide(c.id, "rejected")}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}

export default ItemDetails;
