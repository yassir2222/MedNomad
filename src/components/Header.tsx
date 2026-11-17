export function Header() {
  return (
    <header className="header pol" data-header>
      <div className="header__bar">
        <a
          className="header__logo t-ui"
          href="#top"
          data-header-item
          aria-label="Med Nomad Motion — accueil"
        >
          <img
            className="header__emblem"
            src="/assets/mednomad-logo.png"
            alt="Med Nomad Motion"
            referrerPolicy="no-referrer"
          />
          <span>Med Nomad</span>
        </a>
        <nav className="header__nav t-ui" aria-label="Navigation principale">
          <span className="header__ghost" data-header-item aria-hidden="true">
            Aperçu
          </span>
          <a className="link-dim" href="#catalog" data-header-item>
            Flotte
          </a>
          <a className="link-dim" href="#about" data-header-item>
            Expérience
          </a>
          <a className="link-dim" href="#top" data-header-item>
            Contact
          </a>
        </nav>
        <a className="btn btn--ink header__cta" href="#catalog" data-header-item>
          Réserver
        </a>
        <button
          className="btn btn--ink btn--icon header__menu"
          type="button"
          data-header-item
          aria-label="Menu"
        >
          <i className="bi bi-list" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
