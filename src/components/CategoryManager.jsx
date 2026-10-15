import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../utils/api";

const byName = (list) => [...list].sort((a, b) => a.name.localeCompare(b.name));

// Add, rename and delete categories. The server refuses duplicates and
// categories that still have items, and its message is shown here.
function CategoryManager() {
  const [categories, setCategories] = useState(null); // null = still loading
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    getCategories()
      .then((data) => { if (!ignore) setCategories(byName(data)); })
      .catch((err) => { if (!ignore) setMessage(err.message); });
    return () => { ignore = true; };
  }, []);

  async function run(action) {
    setBusy(true);
    setMessage("");
    try {
      await action();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) {
      setMessage("Type a category name first.");
      return;
    }
    run(async () => {
      const created = await createCategory(newName);
      setCategories((list) => byName([...list, created]));
      setNewName("");
    });
  }

  function startRename(category) {
    setEditingId(category.id);
    setEditName(category.name);
    setMessage("");
  }

  function saveRename(id) {
    if (!editName.trim()) {
      setMessage("The category name cannot be empty.");
      return;
    }
    run(async () => {
      const updated = await updateCategory(id, editName);
      setCategories((list) => byName(list.map((c) => (c.id === id ? updated : c))));
      setEditingId(null);
    });
  }

  function handleDelete(category) {
    if (!window.confirm(`Delete the category "${category.name}"?`)) return;
    run(async () => {
      await deleteCategory(category.id);
      setCategories((list) => list.filter((c) => c.id !== category.id));
    });
  }

  return (
    <div className="dashboard-section">
      <div className="section-heading">
        <div>
          <h2>Categories</h2>
          <p>Add, rename or delete the categories used on reports.</p>
        </div>
      </div>

      <form className="report-actions" onSubmit={handleAdd}>
        <input
          className="input"
          type="text"
          placeholder="New category name"
          aria-label="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn" type="submit" disabled={busy}>Add category</button>
      </form>

      {message && <p className="field-error" role="alert">{message}</p>}

      <div className="dashboard-items">
        {categories === null && !message && <p>Loading categories...</p>}
        {(categories || []).map((category) => (
          <article className="dashboard-item" key={category.id}>
            {editingId === category.id ? (
              <>
                <input
                  className="input"
                  type="text"
                  aria-label={`New name for ${category.name}`}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <div className="report-actions">
                  <button type="button" className="btn" disabled={busy} onClick={() => saveRename(category.id)}>
                    Save
                  </button>
                  <button type="button" className="secondary-button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="item-info">
                  <h3>{category.name}</h3>
                </div>
                <div className="report-actions">
                  <button type="button" className="secondary-button" onClick={() => startRename(category)}>
                    Rename
                  </button>
                  <button type="button" className="close-button" disabled={busy} onClick={() => handleDelete(category)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export default CategoryManager;