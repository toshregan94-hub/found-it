// Temporary storage: a json-server instance serving db.json (run: npm run server)
const API_URL = "http://localhost:3001";

const OFFLINE_MSG =
  "Can't reach the data server. Open a second terminal and run: npm run server";

async function request(path, options) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error(OFFLINE_MSG);
  }
  return res;
}

export async function getItems() {
  const res = await request("/items");
  if (!res.ok) throw new Error("Could not load items.");
  return res.json();
}

export async function addItem(item) {
  const res = await request("/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Could not save your report. Try again.");
  return res.json();
}

const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5555";

async function backendRequest(path, options = {}) {
  let res;

  try {
    res = await fetch(`${BACKEND_API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Can't reach the FoundIt backend.");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Something went wrong.");
  }

  return res.json();
}

export function getMyItems(userId) {
  return backendRequest(`/api/users/${userId}/items`);
}

export function getMyClaims(userId) {
  return backendRequest(`/api/users/${userId}/claims`);
}