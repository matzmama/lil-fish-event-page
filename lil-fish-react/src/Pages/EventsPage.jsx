import "../App.css";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ActionButtons from "../components/ActionButtons";
import FeaturedCarousel from "../components/FeaturedCarousel";
import EventCard from "../components/EventCard";
import RentalCard from "../components/RentalCard";
import CustomPackages from "../components/CustomPackages";
import Footer from "../components/Footer";

import springFestival from "../assets/lil fish harvest festival.png";
import bandPhoto from "../assets/band1.png";
import harvestFestival from "../assets/harvest1.png";
import holidayMarket from "../assets/Lil Fish Holiday market.png";

import weddingPhoto from "../assets/wedding1.png";
import reunionPhoto from "../assets/plain lil fish photo.png";
import graduationPhoto from "../assets/graduation.png";
import anniversaryPhoto from "../assets/anniversary.png";

function EventsPage({ season, setSeason }) {
  const seasonalEventMap = {
    "spring-theme": "Spring Festival",
    "summer-theme": "Summer Concert",
    "fall-theme": "Harvest Festival",
    "winter-theme": "Holiday Market",
  };

  const highlightedEvent = seasonalEventMap[season];

  const events = [
    {
      title: "Spring Festival",
      image: springFestival,
      date: "April 12, 2026",
      time: "9:00 AM",
      location: "Community Center Grounds",
      notes: "Family activities, vendors, food trucks, and live music.",
      buttonText: "Request Information",
      buttonLink: "/contact?type=spring-festival",
    },
    {
      title: "Summer Concert",
      image: bandPhoto,
      date: "July 25, 2026",
      time: "7:00 PM",
      location: "Outdoor Amphitheater",
      notes: "Live performance featuring the Summer Jam Band.",
      buttonText: "Request Information",
      buttonLink: "/contact?type=summer-concert",
    },
    {
      title: "Harvest Festival",
      image: harvestFestival,
      date: "Every Saturday from September through October 2026",
      time: "10:00 AM",
      location: "Community Center Grounds",
      notes:
        "Fall vendors, seasonal food, pumpkin activities, music, and family fun.",
      buttonText: "Request Information",
      buttonLink: "/contact?type=harvest-festival",
    },
    {
      title: "Holiday Market",
      image: holidayMarket,
      date: "Every Saturday from November through December 2026",
      time: "10:00 AM",
      location: "Main Hall",
      notes:
        "Local crafts, holiday gifts, seasonal treats, and community vendors.",
      buttonText: "Request Information",
      buttonLink: "/contact?type=holiday-market",
    },
  ];

  return (
    <div className="events-page">
      <Navbar
        season={season}
        setSeason={setSeason}
      />

      <Hero />

      <ActionButtons />

      <FeaturedCarousel />

      <section className="events-banner" id="upcoming-events">
        <h2>Upcoming Events</h2>

        <p>
          Join us for concerts, festivals, markets, weddings, and community
          celebrations throughout the year.
        </p>
      </section>

      <div className="event-grid">
        {events.map((event) => (
          <div
            key={event.title}
            className={
              event.title === highlightedEvent
                ? "seasonal-event-highlight"
                : ""
            }
          >
            <EventCard
              image={event.image}
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location}
              notes={event.notes}
              buttonText={event.buttonText}
              buttonLink={event.buttonLink}
            />
          </div>
        ))}
      </div>

      <section className="rentals-section">
        <h2>Venue Rentals</h2>

        <div className="rental-grid">
          <RentalCard
            image={weddingPhoto}
            title="Wedding Venue"
            description="Elegant indoor and outdoor spaces for weddings and receptions."
            buttonText="Request Information"
            buttonLink="/contact?type=wedding-venue"
          />

          <RentalCard
            image={reunionPhoto}
            title="Family Reunions"
            description="Large gathering spaces perfect for family celebrations."
            buttonText="Request Information"
            buttonLink="/contact?type=family-reunion"
          />

          <RentalCard
            image={graduationPhoto}
            title="Graduations"
            description="Celebrate academic achievements with friends and family."
            buttonText="Request Information"
            buttonLink="/contact?type=graduation"
          />

          <RentalCard
            image={anniversaryPhoto}
            title="Anniversaries"
            description="Create lasting memories for milestone anniversary celebrations."
            buttonText="Request Information"
            buttonLink="/contact?type=anniversary"
          />
        </div>
      </section>

      <CustomPackages />

      <Footer />
    </div>
  );
}

export default EventsPage;