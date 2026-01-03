/**
 * Landing Screen V2 - Modern landing page
 *
 * Feature-flagged via VITE_USE_NEW_LANDING_PAGE
 */

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';
import { soundService } from '@shared/services/sound-service';
import { useRef } from 'react';

// Section components
import { Header } from './parts/header';
import { HeroSection } from './parts/hero-section';
import { StatsSection } from './parts/stats-section';
import { HowItWorksSection } from './parts/how-it-works-section';
import { TestimonialsSection } from './parts/testimonials-section';
import { FeaturesSection } from './parts/features-section';
import { Footer } from './parts/footer';

export function LandingScreenV2() {
  const navigate = useNavigate();
  const howItWorksRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);

  const handlePlayNow = () => {
    soundService.playButtonClick();
    navigate(ROUTES.multiplayer.mode.absPath);
  };

  const handlePlayAsGuest = () => {
    navigate(ROUTES.howToPlay.absPath);
    soundService.playButtonClick();
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const scrollToRatings = () => {
    testimonialsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onHowItWorksClick={scrollToHowItWorks}
        onFeaturesClick={scrollToFeatures}
        onRatingsClick={scrollToRatings}
        onPlayNowClick={handlePlayNow}
      />
      <HeroSection onPlayNowClick={handlePlayAsGuest} onPlayMultiplayerClick={handlePlayNow} />
      <StatsSection />
      <HowItWorksSection ref={howItWorksRef} onPlayNowClick={handlePlayAsGuest} />
      <TestimonialsSection ref={testimonialsRef} />
      <FeaturesSection ref={featuresRef} />
      <Footer />
    </div>
  );
}
