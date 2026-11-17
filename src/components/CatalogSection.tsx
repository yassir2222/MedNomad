import type { CSSProperties } from 'react';
import { VEHICLES } from '../data/vehicles';

export function CatalogSection() {
  const initial = VEHICLES[0];

  return (
    <section className="catalog" id="catalog" data-catalog aria-label="Véhicules">
      <div className="catalog__screen">
        <div className="widgets" data-widgets aria-label="Véhicule sélectionné">
          <button
            className="widget widget--arrow"
            type="button"
            data-prev
            aria-label="Véhicule précédent"
            style={{ '--i': 0 } as CSSProperties}
          >
            <i className="bi bi-chevron-left" aria-hidden="true" />
          </button>
          <div className="widget widget--main" style={{ '--i': 1 } as CSSProperties}>
            <h3 className="widget__name t-statement" data-w-name>
              {initial.name}
            </h3>
            <div className="widget__row">
              <p className="widget__desc t-body-sm is-dim" data-w-desc>
                {initial.desc}
              </p>
              <a className="btn btn--card" href="#catalog">
                Spécifications
              </a>
            </div>
          </div>
          <div className="widget widget--loc" style={{ '--i': 2 } as CSSProperties}>
            <span className="pill pill--card t-caption">
              <i className="bi bi-geo-alt-fill" aria-hidden="true" />
              <span data-w-loc>{initial.location}</span>
            </span>
            <span className="pill pill--card t-caption" data-w-extra>
              +{initial.extra}
            </span>
          </div>
          <div className="widget widget--price" style={{ '--i': 3 } as CSSProperties}>
            <span className="t-body-sm is-dim">Par jour</span>
            <strong className="widget__price t-price" data-w-price>
              {initial.price}
            </strong>
            <a className="btn btn--ink" href="#catalog">
              Réserver
            </a>
          </div>
          <button
            className="widget widget--arrow"
            type="button"
            data-next
            aria-label="Véhicule suivant"
            style={{ '--i': 4 } as CSSProperties}
          >
            <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
