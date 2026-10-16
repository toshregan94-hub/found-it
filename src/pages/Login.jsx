<<<<<<< HEAD
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5555";

function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function post(path, body) {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
=======
import { useEffect, useState } from "react";
import { login, logout, register, checkSession } from "../utils/api";

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Is someone already logged in?
  useEffect(() => {
    checkSession()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
>>>>>>> upstream/main
  }

  async function handleSubmit(e) {
    e.preventDefault();
<<<<<<< HEAD
    setError("");
    setSubmitting(true);
    try {
      if (mode === "register") {
        await post("/api/register", { username, email, password });
        const data = await post("/api/login", { identifier: username, password });
        setUser(data.user);
      } else {
        const data = await post("/api/login", { identifier, password });
        setUser(data.user);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1>{mode === "login" ? "Log in" : "Create account"}</h1>

      <form onSubmit={handleSubmit}>
        {mode === "login" ? (
          <input
            type="text"
            placeholder="Username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={mode === "register" ? 8 : undefined}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Register"}
        </button>
      </form>

      <p>
        {mode === "login" ? "No account yet? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setError("");
            setMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login" ? "Register" : "Log in"}
        </button>
      </p>
=======
    setMessage("");

    if (isRegistering && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await register(form.username, form.email, form.password);
      }
      // After registering, log straight in. On the login form, "email" can be an email or a username.
      const data = await login(form.email, form.password);
      setUser(data.user);
      setForm({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    setUser(null);
    setMessage("You have logged out.");
  }

  if (user) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome, {user.username}</h1>
            <p>You are logged in as {user.email}.</p>
          </div>
          <button type="button" className="btn auth-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isRegistering ? "Create an account" : "Welcome back"}</h1>
          <p>
            {isRegistering
              ? "Create an account to start using FoundIt."
              : "Log in to manage your lost and found items."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text" className="input"
                placeholder="Choose a username" value={form.username} onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">{isRegistering ? "Email address" : "Email or username"}</label>
            <input id="email" name="email" type={isRegistering ? "email" : "text"} className="input"
              placeholder={isRegistering ? "Enter your email" : "Enter your email or username"}
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input"
              placeholder={isRegistering ? "At least 8 characters" : "Enter your password"}
              value={form.password} onChange={handleChange} required />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className="input"
                placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          )}

          <button type="submit" className="btn auth-button" disabled={loading}>
            {loading ? "Please wait..." : isRegistering ? "Create account" : "Log in"}
          </button>

          {message && <p className="auth-message">{message}</p>}
        </form>

        <div className="auth-switch">
          <p>{isRegistering ? "Already have an account?" : "New to FoundIt?"}</p>
          <button type="button" className="switch-button"
            onClick={() => { setIsRegistering(!isRegistering); setMessage(""); }}>
            {isRegistering ? "Log in" : "Create an account"}
          </button>
        </div>
      </div>
>>>>>>> upstream/main
    </section>
  );
}

export default Login;