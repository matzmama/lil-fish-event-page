import { Link } from "react-router-dom";

import "./CustomPackages.css";

import weddingPhoto from "../assets/wedding1.png";
import graduationPhoto from "../assets/graduation.png";
import retirementPhoto from "../assets/retirement.png";
import anniversaryPhoto from "../assets/anniversary.png";

function CustomPackages() {
  const packages = [
    {
      title: "Wedding Package",
      image: weddingPhoto,
      details: [
        "Starting at $2,500",
        "8-hour rental included",
        "Tables, chairs, and lighting included",
      ],
      buttonLink: "/contact?type=wedding-venue",
    },
    {
      title: "Graduation Celebrations",
      image: graduationPhoto,
      details: [
        "Starting at $850",
        "4-hour rental included",
        "Decor add-ons available",
      ],
      buttonLink: "/contact?type=graduation",
    },
    {
      title: "Retirement Parties",
      image: retirementPhoto,
      details: [
        "Starting at $700",
        "Indoor and outdoor seating available",
        "Sound system included",
      ],
      buttonLink: "/contact?type=retirement",
    },
    {
      title: "Anniversary Celebrations",
      image: anniversaryPhoto,
      details: [
        "Starting at $950",
        "5-hour rental package",
        "Elegant lighting package available",
      ],
      buttonLink: "/contact?type=anniversary",
    },
  ];

  return (
    <section className="custom-packages">
      <h2>Custom Event Packages</h2>

      <div className="package-grid">
        {packages.map((eventPackage) => (
          <div className="package-card" key={eventPackage.title}>
            <img
              src={eventPackage.image}
              alt={eventPackage.title}
              className="package-image"
            />

            <div className="package-card-content">
              <h3>{eventPackage.title}</h3>

              <div className="package-details">
                {eventPackage.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>

              <Link
                to={eventPackage.buttonLink}
                className="package-card-btn"
              >
                Request Information
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="custom-quote">
        <h2>Need Something Unique?</h2>

        <p>
          Hosting a family reunion, birthday celebration, corporate gathering,
          fundraiser, school event, community festival, or another special
          occasion? We can create a package tailored specifically to your
          needs.
        </p>

        <Link
          to="/contact?type=custom-event"
          className="custom-quote-btn"
        >
          Request a Custom Quote
        </Link>
      </div>
    </section>
  );
}

export default CustomPackages;