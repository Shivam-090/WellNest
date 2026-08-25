import JourneyHero from '../../components/journey/JourneyHero';
import LevelPath from '../../components/journey/LevelPath';
import XpProgress from '../../components/journey/XpProgress';

export default function JourneyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
      <JourneyHero />
      <LevelPath />
      <XpProgress />
    </div>
  );
}
