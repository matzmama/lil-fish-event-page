import "./Home.css";

import Navbar from "../components/Navbar";
import InteractiveHero from "../components/InteractiveHero";
import HomeFlipCards from "../components/HomeFlipCards";
import EventCountdown from "../components/EventCountdown";
import Footer from "../components/Footer";

function Home({ season, setSeason }) {
  return (
    <div className="home-page">
      <Navbar
        season={season}
        setSeason={setSeason}
      />

      <main>
        <InteractiveHero />

        <HomeFlipCards />

        <EventCountdown />
      </main>

      <Footer />
    </div>
  );
}

export default Home;