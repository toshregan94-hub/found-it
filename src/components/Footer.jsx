import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-brand">FoundIt ✨</p>
      <p>Helping lost items find their way home.</p>
      <p className="footer-small">
        © {new Date().getFullYear()} FoundIt · All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;