import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeaturedCarousel from "../components/FeaturedCarousel";

import "./Gallery.css";

import harvest1 from "../assets/harvest1.png";
import harvest2 from "../assets/harvest2.png";
import harvest3 from "../assets/harvest3.png";

import winter1 from "../assets/winter1.png";
import winter2 from "../assets/winter2.png";
import winter3 from "../assets/winter3.png";

import band1 from "../assets/band1.png";
import band2 from "../assets/band2.png";
import band3 from "../assets/band3.png";

import wedding1 from "../assets/wedding1.png";
import wedding2 from "../assets/wedding2.png";
import wedding3 from "../assets/wedding3.png";

function Gallery({ season, setSeason }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const gallerySections = [
    {
      title: "Harvest Festival 2026",
      category: "Festivals",
      images: [harvest1, harvest2, harvest3],
    },
    {
      title: "Winter Market 2025",
      category: "Holiday",
      images: [winter1, winter2, winter3],
    },
    {
      title: "Live Music & Concerts",
      category: "Music",
      images: [band1, band2, band3],
    },
    {
      title: "Weddings & Celebrations",
      category: "Weddings",
      images: [wedding1, wedding2, wedding3],
    },
  ];

  const categories = [
    "All",
    "Weddings",
    "Festivals",
    "Music",
    "Holiday",
  ];

  const filteredSections =
    selectedCategory === "All"
      ? gallerySections
      : gallerySections.filter(
          (section) => section.category === selectedCategory
        );

  return (
    <div className="gallery-wrapper">
      <Navbar
        season={season}
        setSeason={setSeason}
      />

      <main className="gallery-page">
        <section className="gallery-hero">
          <div className="gallery-hero-content">
            <h1>Gallery & Event Highlights</h1>

            <p>
              Celebrating weddings, concerts, festivals, and unforgettable
              community moments.
            </p>
          </div>
        </section>

        <FeaturedCarousel />

        <section className="gallery-filter-section">
          <h2>Explore by Event Type</h2>

          <div className="gallery-filter-buttons">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={
                  selectedCategory === category
                    ? "filter-btn active-filter"
                    : "filter-btn"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {filteredSections.map((section) => (
          <section
            className="gallery-section"
            key={section.title}
          >
            <h2>{section.title}</h2>

            <div className="gallery-grid">
              {section.images.map((image, imageIndex) => (
                <button
                  type="button"
                  key={`${section.title}-${imageIndex}`}
                  className="gallery-image-button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`Open ${section.title} image ${imageIndex + 1}`}
                >
                  <img
                    src={image}
                    alt={`${section.title} ${imageIndex + 1}`}
                    className="gallery-img"
                  />
                </button>
              ))}
            </div>
          </section>
        ))}

        {selectedImage && (
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Expanded gallery image"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              className="close-lightbox"
              onClick={() => setSelectedImage(null)}
              aria-label="Close gallery image"
            >
              &times;
            </button>

            <img
              src={selectedImage}
              alt="Expanded gallery view"
              className="lightbox-img"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Gallery;