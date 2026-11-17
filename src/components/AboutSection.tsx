import type { CSSProperties } from 'react';
import { PARTNER_BRANDS } from '../data/vehicles';

export function AboutSection() {
  return (
    <section className="about" id="about" data-about aria-label="À propos">
      <div className="about__pin">
        <div className="about__slot" data-media-slot aria-hidden="true" />
        <div className="about__copy">
          <h2 className="about__statement t-statement" data-about-in data-split="lines">
            L&apos;important n&apos;est pas d&apos;arriver. C&apos;est la manière dont vous arrivez.
            Votre voiture vous attend devant la porte — prête, préparée, silencieuse.
          </h2>
          <a
            className="btn btn--soft"
            href="#catalog"
            data-about-in
            style={{ '--in-y': '14svh' } as CSSProperties}
          >
            Réserver
          </a>
        </div>
        <div
          className="marquee about__marquee"
          data-marquee
          data-about-in
          data-scroll
          aria-label="Marques partenaires"
        >
          <div className="marquee__track">
            {PARTNER_BRANDS.map((brand) => (
              <span key={brand} className="marquee__item t-caption">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
