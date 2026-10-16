import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMatches } from "../utils/api";
import "./PossibleMatches.css";

function PossibleMatches({ itemId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getMatches(itemId)
      .then((data) => {
        if (!ignore) {
          setMatches(data.matches || []);
          setError("");
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [itemId]);

  if (loading) {
    return (
      <section className="matches-section">
        <h2>Possible Matches</h2>
        <p>Loading possible matches...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="matches-section">
        <h2>Possible Matches</h2>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="matches-section">
      <h2>Possible Matches</h2>

      {matches.length === 0 && (
        <p>No possible matches found yet.</p>
      )}

      <div className="matches-list">
        {matches.map((match) => (
          <div className="match-card" key={match.item.id}>
            <h3>{match.item.title}</h3>

            <div className="match-details">
              <p>
                <strong>Category:</strong> {match.item.category}
              </p>

              <p>
                <strong>Location:</strong> {match.item.location}
              </p>

              <p>
                <strong>Date:</strong> {match.item.date}
              </p>

              <p>
                <strong>Match score:</strong> {match.score}
              </p>

              {match.distance_km !== null && (
                <p>
                  <strong>Distance:</strong> {match.distance_km} km
                </p>
              )}
            </div>

            <Link
              className="match-link"
              to={`/items/${match.item.id}`}
            >
              View Item
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PossibleMatches;