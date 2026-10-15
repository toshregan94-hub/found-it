import Hero from "../components/Hero";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getItems, getCategories } from "../utils/api";
import "./Home.css";

function Home() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState(null); // null = still loading
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {}); // the category filter just stays empty; the item error below covers a down server
  }, []);

  // The backend does the searching and filtering; the newest reports come first.
  // The short delay stops a request being sent on every keystroke.
  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(() => {
      getItems({ search, type: filter, categoryId })
        .then((data) => {
          if (!ignore) {
            setItems(data);
            setError("");
          }
        })
        .catch((err) => { if (!ignore) setError(err.message); });
    }, 300);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search, filter, categoryId]);

  const shownItems = items || [];

  return (
    <div className="container">
        <Hero />

      <div className="home-controls">
        <input
          className="input"
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input"
          aria-label="Filter by category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <div className="filter-buttons">
          {["all", "lost", "found"].map((type) => (
            <button
              key={type}
              className={filter === type ? "btn" : "btn btn-outline"}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="empty">{error}</p>
      ) : items === null ? (
        <p className="empty">Loading items...</p>
      ) : shownItems.length === 0 ? (
        <p className="empty">No items match your search.</p>
      ) : (
        <div className="items-grid">
          {shownItems.map((item) => (
            <Link to={`/items/${item.id}`} key={item.id} className="card item-card">
              {item.photo && <img className="item-card-photo" src={item.photo} alt={item.itemName} />}
              <span className={`badge badge-${item.reportType}`}>{item.reportType}</span>
              <h3>{item.itemName}</h3>
              <p>{item.location.name}</p>
              <small>{item.category} · {item.date}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;