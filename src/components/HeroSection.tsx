export function HeroSection() {
  return (
    <section className="hero" data-hero aria-label="Introduction">
      <div className="hero__side">
        <span className="pill hero__pill t-caption" data-hero-ui>
          <i className="bi bi-geo-alt-fill" aria-hidden="true" />
          Marrakech
        </span>
        <p className="hero__desc t-body" data-hero-ui>
          La voiture de votre choix, à votre porte. Sans comptoir, sans paperasse — juste les clés.
        </p>
      </div>
      <p className="hero__hint t-ui" data-hero-ui>
        Défiler <i className="bi bi-arrow-down" aria-hidden="true" />
      </p>
      <h1 className="hero__title t-display" data-hero-title>
        <span className="hero__ghost">Premium</span>
        <span className="hero__main">
          Location
          <br />
          Auto
        </span>
      </h1>
    </section>
  );
}
