import "./ContactPage.css";

import Navbar from "../components/Navbar";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

import logo from "../assets/lil fish logo.png";

function ContactPage({ season, setSeason }) {
  return (
    <div className="contact-page">
      <Navbar
        season={season}
        setSeason={setSeason}
      />

      <section className="contact-hero">
        <div className="logo-card">
          <img
            src={logo}
            alt="Lil Fish Community Center Logo"
          />
        </div>

        <h1>Book Your Next Event</h1>

        <p>
          Weddings, concerts, holiday markets, harvest festivals, and
          unforgettable community gatherings.
        </p>
      </section>

      <div className="contact-info">
        <h2>Contact Us</h2>

        <p>
          <strong>Address:</strong>
          <br />
          102 Riverbend Lane
          <br />
          Lil Fish, Oregon 97211
        </p>

        <p>
          <strong>Phone:</strong>
          <br />
          (555) 867-5309
        </p>

        <p>
          <strong>Email:</strong>
          <br />
          bookings@lilfishcc.com
        </p>
      </div>

      <ContactForm />

      <Footer />
    </div>
  );
}

export default ContactPage;