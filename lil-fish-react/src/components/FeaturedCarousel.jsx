import { useEffect, useState } from "react";
import "./FeaturedCarousel.css";

import harvestFestival from "../assets/lil fish harvest festival.png";
import bandPhoto from "../assets/band1.png";
import holidayMarket from "../assets/Lil Fish Holiday market.png";

function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredEvents = [
    {
      title: "Spring Festival",
      date: "April 12, 2026",
      image: harvestFestival,
      description:
        "Family activities, vendors, food trucks, and live music throughout the community center grounds.",
    },
    {
      title: "Summer Concert",
      date: "July 25, 2026",
      image: bandPhoto,
      description:
        "An evening of live music featuring the Summer Jam Band at the outdoor amphitheater.",
    },
    {
      title: "Holiday Market",
      date: "December 3, 2026",
      image: holidayMarket,
      description:
        "Local crafts, holiday gifts, seasonal treats, and community vendors inside the main hall.",
    },
  ];

  const currentEvent = featuredEvents[currentIndex];

  function goToPrevious() {
    const previousIndex =
      currentIndex === 0 ? featuredEvents.length - 1 : currentIndex - 1;

    setCurrentIndex(previousIndex);
  }

  function goToNext() {
    const nextIndex =
      currentIndex === featuredEvents.length - 1 ? 0 : currentIndex + 1;

    setCurrentIndex(nextIndex);
  }

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentIndex((previousIndex) =>
        previousIndex === featuredEvents.length - 1 ? 0 : previousIndex + 1
      );
    }, 6000);

    return () => clearInterval(slideTimer);
  }, [featuredEvents.length]);

  return (
    <section className="featured-carousel-section">
      <div className="carousel-heading">
        <p>Featured Events</p>
        <h2>Discover What’s Happening Next</h2>
      </div>

      <div className="featured-carousel">
        <button className="carousel-arrow" onClick={goToPrevious}>
          ←
        </button>

        <div className="carousel-card" key={currentEvent.title}>
          <div className="carousel-image-wrapper">
            <span className="featured-badge">★★★★★ Featured Event</span>

            <img src={currentEvent.image} alt={currentEvent.title} />
          </div>

          <div className="carousel-content">
            <p className="carousel-slide-count">
              {currentIndex + 1} / {featuredEvents.length}
            </p>

            <p className="carousel-date">{currentEvent.date}</p>

            <h3>{currentEvent.title}</h3>

            <p>{currentEvent.description}</p>

            <a href="#upcoming-events" className="carousel-btn">
              View Event Details
            </a>
          </div>
        </div>

        <button className="carousel-arrow" onClick={goToNext}>
          →
        </button>
      </div>

      <div className="carousel-dots">
        {featuredEvents.map((event, index) => (
          <button
            key={event.title}
            className={index === currentIndex ? "dot active-dot" : "dot"}
            onClick={() => setCurrentIndex(index)}
            aria-label={`View ${event.title}`}
          ></button>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCarousel;