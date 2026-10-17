import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  checkSession,
  getMyItems,
  getMyClaims,
  updateItem,
  deleteItem,
} from "../utils/api";

const STATUS_LABELS = {
  active: "Active",
  claimed: "Claimed",
  resolved: "Returned",
};

function formatDate(iso) {
  if (!iso) return "";

  const date = new Date(`${iso}T00:00:00`);

  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Dashboard() {
  const [user, setUser] = useState(undefined);
  const [reports, setReports] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      const session = await checkSession();

      if (ignore) return;

      if (!session.logged_in || !session.user) {
        setUser(null);
        return;
      }

      setUser(session.user);

      const [items, claimsData] = await Promise.all([
        getMyItems(session.user.id),
        getMyClaims(session.user.id),
      ]);

      if (!ignore) {
        setReports(items);
        setClaims(claimsData.claims || []);
      }
    }

    load().catch((err) => {
      if (!ignore) setLoadError(err.message);
    });

    return () => {
      ignore = true;
    };
  }, []); 


  // Runs one request, shows the server's message if it fails.
  async function run(action) {
    setSaving(true);
    setActionError("");
    try {
      await action();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const startEditing = (report) => {
    setEditingId(report.id);
    setEditForm({ title: report.itemName, location: report.location.name });
    setActionError("");
  };

  const saveEdit = (report) => {
    const title = editForm.title.trim();
    const place = editForm.location.trim();
    if (!title) {
      setActionError("The item name cannot be empty.");
      return;
    }
    const changes = { itemName: title };
    // a new place name means the saved map coordinates no longer match, so clear them
    if (place !== report.location.name) changes.location = { name: place, lat: null, lon: null };

    run(async () => {
      const updated = await updateItem(report.id, changes);
      setReports((list) => list.map((r) => (r.id === report.id ? updated : r)));
      setEditingId(null);
    });
  };

  const closeReport = (report) =>
    run(async () => {
      const updated = await updateItem(report.id, { status: "resolved" });
      setReports((list) => list.map((r) => (r.id === report.id ? updated : r)));
    });

  const deleteReport = (report) => {
    if (!window.confirm(`Delete "${report.itemName}"? Any claims on it will be deleted too.`)) return;
    run(async () => {
      await deleteItem(report.id);
      setReports((list) => list.filter((r) => r.id !== report.id));
    });
  };

  if (user === null) {
    return (
      <section className="dashboard-page">
        <h1>Your dashboard</h1>
        <p>Please log in to see and manage your reports. <Link to="/login">Log in</Link></p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="dashboard-page">
        <p className="empty">{loadError}</p>
      </section>
    );
  }

  if (user === undefined || reports === null) {
    return (
      <section className="dashboard-page">
        <p className="empty">Loading your dashboard...</p>
      </section>
    );
  }

  const lostItems = reports.filter((report) => report.reportType === "lost").length;
  const foundItems = reports.filter((report) => report.reportType === "found").length;
  const returnedItems = reports.filter((report) => report.status === "resolved").length;

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-label">MY ACCOUNT</p>
          <h1>Welcome to your dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your lost and found items and claims in one place.
          </p>
        </div>

        <Link to="/repot" className="btn">Report an item</Link>
      </div>

      {/* Dashboard statistics */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{lostItems}</span>
          <span className="stat-label">Lost items</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{foundItems}</span>
          <span className="stat-label">Found items</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{returnedItems}</span>
          <span className="stat-label">Items returned</span>
        </div>
      </div>

      {/* My reported items */}
      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>My reported items</h2>
            <p>
              View, edit, close or delete the items you have reported.
            </p>
          </div>
        </div>

        {actionError && <p className="field-error" role="alert">{actionError}</p>}

        <div className="dashboard-items">
          {reports.length === 0 && (
            <p>You have not reported anything yet. <Link to="/report">Report an item</Link></p>
          )}

          {reports.map((report) => (
            <article className="dashboard-item" key={report.id}>
              {editingId === report.id ? (
                <div className="edit-report-form">
                  <h3>Edit report</h3>

                  <div className="form-group">
                    <label htmlFor={`title-${report.id}`}>
                      Item name
                    </label>
                    <input
                      id={`title-${report.id}`}
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`location-${report.id}`}>
                      Location
                    </label>
                    <input
                      id={`location-${report.id}`}
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="report-actions">
                    <button
                      type="button"
                      className="btn"
                      disabled={saving}
                      onClick={() => saveEdit(report)}
                    >
                      Save changes
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="item-info">
                    <span
                      className={`badge ${
                        report.reportType === "lost"
                          ? "badge-lost"
                          : "badge-found"
                      }`}
                    >
                      {report.reportType === "lost" ? "Lost" : "Found"}
                    </span>

                    <h3>{report.itemName}</h3>

                    <p>Reported from {report.location.name}</p>

                    <span className="item-date">
                      {formatDate(report.date)}
                    </span>

                    {report.status === "resolved" && (
                      <span className="closed-text">
                        This report has been closed.
                      </span>
                    )}
                  </div>

                  <div className="report-right">
                    <span
                      className={`status-badge ${
                        report.status === "resolved"
                          ? "status-returned"
                          : "status-active"
                      }`}
                    >
                      {STATUS_LABELS[report.status] || report.status}
                    </span>

                    <div className="report-actions">
                      {report.status !== "resolved" && (
                        <>
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => startEditing(report)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="close-button"
                            disabled={saving}
                            onClick={() => closeReport(report)}
                          >
                            Close report
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        className="close-button"
                        disabled={saving}
                        onClick={() => deleteReport(report)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* My claims */}
      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>My claims</h2>
            <p>View the claims you have submitted for found items.</p>
          </div>
        </div>

        <div className="dashboard-items">
          {claims.length === 0 && (
          <p>You have not submitted any claims yet.</p>)}
          {claims.map((claim) => (
            <article className="dashboard-item" key={claim.id}>
              <div className="item-info">
                <h3>{`Item #${claim.item_id}`}</h3>

                <p>
                  Claim submitted on{" "}
                  {claim.created_at
                    ? new Date(claim.created_at).toLocaleDateString("en-GB")
                    : "Unknown date"}
                </p>
              </div>
              <Link to={`/items/${claim.item_id}`} className="secondary-button">
                View item
              </Link>
              <span
                className={`status-badge ${
                  claim.status === "approved"
                    ? "status-returned"
                    : "status-active"
                }`}
              >
                {claim.status
                  ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1)
                  : "Unknown"}
              </span>
            </article>
          ))}
        </div>
      </div>

      {/* Account information */}
      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Account information</h2>
            <p>Your account details will appear here.</p>
          </div>
        </div>

        <div className="account-card">
          <div>
            <span className="account-label">Name</span>
            <strong>{user?.username || "Unknown user"}</strong>
          </div>

          <div>
            <span className="account-label">Email</span>
            <strong>{user?.email || "No email available"}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Dashboard;