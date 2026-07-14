import { Link } from "react-router-dom";

import "./About.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import centerPhoto from "../assets/plain lil fish photo.png";

function About({ season, setSeason }) {
  return (
    <div className="about-page">
      <Navbar
        season={season}
        setSeason={setSeason}
      />

      <main className="about-main">
        <section className="about-intro">
          <div className="about-heading">
            <p className="about-kicker">Our Story</p>

            <h1>Small-Town Roots. A Place for Everyone.</h1>

            <p className="about-lead">
              For nearly a century, Lil Fish Community Center has brought
              families, neighbors, and visitors together for life’s most
              meaningful moments.
            </p>
          </div>

          <div className="about-story-grid">
            <div className="about-image-wrapper">
              <img
                src={centerPhoto}
                alt="Exterior of Lil Fish Community Center"
                className="about-image"
              />
            </div>

            <div className="about-story">
              <h2>Bringing People Together Since 1926</h2>

              <p>
                Nestled in the heart of a small farming and fishing town, Lil
                Fish Community Center began as a simple meeting hall where
                neighbors could gather, celebrate, and support one another.
              </p>

              <p>
                Over the years, it has grown into one of the community’s most
                beloved event spaces—hosting weddings, graduations, live music,
                seasonal festivals, anniversary celebrations, and local
                traditions.
              </p>

              <p>
                Today, Lil Fish continues that legacy through warm hospitality,
                welcoming spaces, and events that create lasting memories.
              </p>
            </div>
          </div>
        </section>

        <section className="about-values-section">
          <div className="about-values-heading">
            <p className="about-kicker">Why Lil Fish</p>

            <h2>More Than an Event Venue</h2>
          </div>

          <div className="about-values-grid">
            <article className="about-value-card">
              <span className="about-value-number">01</span>

              <h3>Community First</h3>

              <p>
                Every gathering is supported with the warmth and care you would
                expect from a close-knit community.
              </p>
            </article>

            <article className="about-value-card">
              <span className="about-value-number">02</span>

              <h3>Built for Milestones</h3>

              <p>
                From weddings and graduations to reunions and festivals, our
                spaces adapt to life’s biggest moments.
              </p>
            </article>

            <article className="about-value-card">
              <span className="about-value-number">03</span>

              <h3>Rooted in Tradition</h3>

              <p>
                Nearly a century of local history gives every celebration at
                Lil Fish a genuine sense of place.
              </p>
            </article>
          </div>
        </section>

        <section className="about-cta">
          <div>
            <p className="about-kicker">
              Come Celebrate With Us
            </p>

            <h2>Your Next Memory Can Start Here</h2>
          </div>

          <div className="about-cta-actions">
            <Link to="/events" className="about-primary-btn">
              Explore Events
            </Link>

            <Link
              to="/contact?type=custom-event"
              className="about-secondary-btn"
            >
              Plan Your Event
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default About;