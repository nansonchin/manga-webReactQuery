import { Link, useLocation } from "react-router-dom";

function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <section style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
      <h1>404 - Page not found</h1>
      <p>
        No page matches <code>{pathname}</code>
      </p>
      <Link to="/manga">Back to manga list</Link>
    </section>
  );
}

export default NotFoundPage;