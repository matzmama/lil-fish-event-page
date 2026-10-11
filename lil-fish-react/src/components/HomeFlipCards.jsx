import "./HomeFlipCards.css";
import { Link } from "react-router-dom";

import harvestFestival from "../assets/lil fish harvest festival.png";
import holidayMarket from "../assets/Lil Fish Holiday market.png";
import weddingPhoto from "../assets/wedding1.png";

function HomeFlipCards() {
  return (
    <section className="home-flip-section">
      <h2>Featured Experiences</h2>

      <p className="home-flip-intro">
        Explore signature events, vendor opportunities, and celebration spaces
        at Lil Fish Community Center.
      </p>

      <div className="home-flip-grid">
        <div className="home-flip-card">
          <div className="home-flip-inner">
            <div className="home-flip-front">
              <img src={harvestFestival} alt="Harvest Festival" />
              <h3>Harvest Festival</h3>
            </div>

            <div className="home-flip-back">
              <h3>Harvest Festival</h3>

              <p className="price-line">Vendor Booths: Starting at $100</p>

              <p>
                Local food, family activities, music, seasonal vendors, and
                community traditions.
              </p>

              <Link
                to="/contact?type=harvest-festival"
                className="flip-card-btn"
              >
                 Reserve Vendor Space
              </Link>

            </div>
          </div>
        </div>

        <div className="home-flip-card">
          <div className="home-flip-inner">
            <div className="home-flip-front">
              <img src={holidayMarket} alt="Holiday Market" />
              <h3>Holiday Market</h3>
            </div>

            <div className="home-flip-back">
              <h3>Holiday Market</h3>

              <p className="price-line">Vendor Booths: Starting at $100</p>

              <p>
                Indoor vendor spaces for artists, bakers, boutiques, and local
                makers.
              </p>
              <Link
                 to="/contact?type=holiday-market"
                className="flip-card-btn"
              >
                 Reserve Vendor Space
              </Link>
            </div>
          </div>
        </div>

        <div className="home-flip-card">
          <div className="home-flip-inner">
            <div className="home-flip-front">
              <img src={weddingPhoto} alt="Wedding Venue" />
              <h3>Weddings & Celebrations</h3>
            </div>

            <div className="home-flip-back">
              <h3>Weddings & Celebrations</h3>

              <p className="price-line">Venue Rentals: Starting at $1,500</p>

              <p>
                Host weddings, receptions, anniversaries, graduations, and
                milestone celebrations.
              </p>

              <Link
                to="/contact?type=wedding-venue"
                className="flip-card-btn"
              >
                Plan a Celebration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeFlipCards;
