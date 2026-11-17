import { useEffect } from 'react';
import { Header } from './components/Header';
import { StageScene } from './components/StageScene';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CatalogSection } from './components/CatalogSection';
import { gsap, ScrollTrigger } from './motion/gsap';
import { applyBeats, beats, N } from './motion/beats';
import { initScroll, destroyScroll, getScroll } from './motion/scroll';
import { initSplit } from './motion/split';
import { initImageLoad, replay } from './motion/reveal';
import { initHeader } from './motion/header';
import { initHeroVideo } from './motion/hero-video';
import { initMedia } from './motion/media';
import { initHero } from './motion/hero';
import { initAbout } from './motion/about';
import { initMarquee } from './motion/marquee';
import { initWords } from './motion/words';
import { initCatalog } from './motion/catalog';
import { initSlider } from './motion/slider';
import { setPol, getPol } from './motion/pol';

export function App() {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    applyBeats();

    const scroll = initScroll();
    const revertSplit = initSplit();
    initImageLoad();
    const header = initHeader();
    const heroVideo = initHeroVideo();
    const media = initMedia({ heroVideo, beats, onPol: setPol });
    const hero = initHero({ header, beats, ready: heroVideo.ready });
    const about = initAbout({ beats });
    const marquee = initMarquee();
    const words = initWords();
    const catalog = initCatalog({ words });
    const slider = initSlider({
      media,
      beats,
      onChange: (i) => catalog?.swap(i),
      onReset: () => catalog?.reset(0),
    });

    const mq = matchMedia('(max-width: 767px)');
    const onBpChange = () => {
      applyBeats();
      ScrollTrigger.refresh();
    };
    mq.addEventListener('change', onBpChange);

    window.__site = {
      scroll,
      gsap,
      ScrollTrigger,
      header,
      hero,
      about,
      marquee,
      words,
      catalog,
      slider,
      heroVideo,
      media,
      beats,
      N,
      replay,
      setPol,
      refresh: () => ScrollTrigger.refresh(),
      drive: (y: number) => {
        getScroll()?.scrollTo(y, { immediate: true, force: true });
        ScrollTrigger.update();
      },
      state: () => ({
        y: +(scroll?.lenisInstance?.scroll ?? window.scrollY).toFixed(1),
        H: window.innerHeight,
        W: window.innerWidth,
        facts: media?.facts(),
        pol: getPol(),
      }),
    };

    return () => {
      mq.removeEventListener('change', onBpChange);
      slider?.revert();
      catalog?.revert();
      words?.revert();
      marquee?.revert();
      about?.revert();
      hero?.revert();
      media?.revert();
      heroVideo?.revert();
      header?.revert();
      revertSplit();
      destroyScroll();
      delete window.__site;
    };
  }, []);

  return (
    <>
      <Header />
      <main id="top">
        <div className="stage" data-stage>
          <StageScene />
          <HeroSection />
          <AboutSection />
          <CatalogSection />
        </div>
      </main>
    </>
  );
}

export default App;
