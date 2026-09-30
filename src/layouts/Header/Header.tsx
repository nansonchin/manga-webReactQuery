import { Link, useLocation } from "react-router-dom";
import "./Header.scss";

function Header() {
  const location = useLocation();

  const isMangaSection = location.pathname.startsWith("/manga");

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          to="/manga"
          className="site-header__brand"
          aria-label="Manga Archive home"
        >
          <span className="site-header__brand-mark" aria-hidden="true">
            B
          </span>

          <span className="site-header__brand-text">
            <span className="site-header__brand-name">
              MANGA ARCHIVE
            </span>

            <span className="site-header__brand-subtitle">
              DIGITAL LIBRARY
            </span>
          </span>
        </Link>

        <nav
          className="site-header__navigation"
          aria-label="Main navigation"
        >
          <Link
            to="/manga"
            className={`site-header__link ${
              isMangaSection ? "site-header__link--active" : ""
            }`}
            aria-current={isMangaSection ? "page" : undefined}
          >
            Manga
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;


