import { HERO_MEDIA, VEHICLES } from '../data/vehicles';

export function StageScene() {
  return (
    <div className="stage__scene" data-scene>
      <p className="catalog__words t-statement" data-words>
        Une collection privée, pas un parking : de la G-Class Sport au TMAX 2026, chaque véhicule
        préparé, assuré et livré devant chez vous dans l&apos;heure, partout à Marrakech.
      </p>
      <div className="row" data-row aria-hidden="true">
        {VEHICLES.map((vehicle) =>
          vehicle.isPrimaryMedia ? (
            <div key={vehicle.id} className="car media" data-car={vehicle.id} data-media>
              <video
                className="media__video"
                data-hero-video
                muted
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                poster={HERO_MEDIA.poster}
                src={HERO_MEDIA.video}
              />
              <img
                className="media__cut"
                data-cut
                src={vehicle.image}
                alt={vehicle.alt}
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div key={vehicle.id} className="car" data-car={vehicle.id}>
              <img
                className="car__cut"
                src={vehicle.image}
                alt={vehicle.alt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
          ),
        )}
      </div>
    </div>
  );
}
