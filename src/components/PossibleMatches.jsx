
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  PackageSearch,
  Tag,
  Target,
} from "lucide-react";
import { getMatches } from "../utils/api";
import "./PossibleMatches.css";

function PossibleMatches({ itemId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError("");
    setMatches([]);

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

  return (
    <section className="matches-section">
      <div className="matches-heading">
        <div>
          <h2>Possible Matches</h2>
          <p>
            These reports may be related to this item.
            Take a closer look to see if they match.
          </p>
        </div>

        <div className="matches-heading-icon" aria-hidden="true">
          <PackageSearch size={25} strokeWidth={1.8} />
        </div>
      </div>

      {loading ? (
        <p className="matches-message">
          Loading possible matches...
        </p>
      ) : error ? (
        <p className="matches-message matches-message--error">
          {error}
        </p>
      ) : matches.length === 0 ? (
        <div className="matches-empty">
          <PackageSearch size={32} strokeWidth={1.6} />
          <h3>No possible matches yet</h3>
          <p>
            There are no matching reports at the moment.
            You can check again later.
          </p>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map((match) => {
            const matchedItem = match.item;
            const matchName =
              matchedItem.itemName ??
              matchedItem.title ??
              "Reported item";

            const location =
              typeof matchedItem.location === "string"
                ? matchedItem.location
                : matchedItem.location?.name ||
                  "Not specified";

            const hasDistance =
              match.distance_km !== null &&
              match.distance_km !== undefined;

            return (
              <article
                className="match-card"
                key={matchedItem.id}
              >

                <div className="match-card-visual">
                  {matchedItem.image_url ? (
                    <img
                      src={matchedItem.image_url}
                      alt={matchName}
                      className="match-card-image"
                      loading="lazy"
                    />
                  ) : (
                    <PackageSearch
                      size={36}
                      strokeWidth={1.4}
                      aria-label="No photo available"
                    />
                  )}
                </div>

                <div className="match-card-content">

                    <div className="match-card-top">
                      {matchedItem.type && (
                        <span
                          className={`match-type-badge match-type-badge--${matchedItem.type}`}
                        >
                          {matchedItem.type}
                        </span>
                      )}

                      <h3>{matchName}</h3>
                    </div>

                  <div className="match-details">
                    <span className="match-detail">
                      <Tag size={16} />
                      {matchedItem.category ||
                        "Not specified"}
                    </span>

                    <span className="match-detail">
                      <MapPin size={16} />
                      {location}
                    </span>

                    <span className="match-detail">
                      <CalendarDays size={16} />
                      {matchedItem.date ||
                        "Not specified"}
                    </span>
                  </div>

                  <div className="match-metrics">
                    <span className="match-score">
                      <Target size={16} />
                      Match score: {match.score}
                    </span>

                    {hasDistance && (
                      <span className="match-distance">
                        <MapPin size={15} />
                        {match.distance_km} km away
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  className="match-link"
                  to={`/items/${matchedItem.id}`}
                  aria-label={`View ${matchName}`}
                >
                  <span>View item</span>
                  <ArrowUpRight size={18} />
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default PossibleMatches;
