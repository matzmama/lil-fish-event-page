import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./ContactForm.css";

function ContactForm() {
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const selectedType = searchParams.get("type");

    if (selectedType) {
      setFormData((previousData) => ({
        ...previousData,
        interest: selectedType,
      }));
    }
  }, [searchParams]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Booking inquiry submitted:", formData);

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      interest: "",
      message: "",
    });
  }

  return (
    <section className="contact-booking-section">
      <h2>Booking Inquiry</h2>

      <p className="contact-booking-intro">
        Tell us about your event, and our team will follow up with availability,
        pricing, and next steps.
      </p>

      {submitted && (
        <div className="contact-success-message" role="status">
          Thank you! Your inquiry has been received.
        </div>
      )}

      <form className="contact-booking-form" onSubmit={handleSubmit}>
        <label htmlFor="contact-name">Your Name</label>

        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="contact-email">Your Email</label>

        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="contact-interest">
          What are you interested in?
        </label>

        <select
          id="contact-interest"
          name="interest"
          value={formData.interest}
          onChange={handleChange}
          required
        >
          <option value="">Select an option</option>
          <option value="spring-festival">Spring Festival</option>
          <option value="summer-concert">Summer Concert</option>
          <option value="harvest-festival">Harvest Festival</option>
          <option value="holiday-market">Holiday Market</option>
          <option value="wedding-venue">Wedding Venue</option>
          <option value="family-reunion">Family Reunion</option>
          <option value="graduation">Graduation Celebration</option>
          <option value="retirement">Retirement Party</option>
          <option value="anniversary">Anniversary Celebration</option>
          <option value="custom-event">Custom Event Package</option>
        </select>

        <label htmlFor="contact-message">
          Tell us about your event
        </label>

        <textarea
          id="contact-message"
          name="message"
          placeholder="Tell us about your event"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Submit Inquiry</button>
      </form>
    </section>
  );
}

export default ContactForm;