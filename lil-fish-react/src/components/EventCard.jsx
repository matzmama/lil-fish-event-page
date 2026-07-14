import { Link } from "react-router-dom";
import "./EventCard.css";

function EventCard({
  image,
  title,
  date,
  time,
  location,
  notes,
  buttonText = "Request Information",
  buttonLink = "/contact",
}) {
  return (
    <div className="event-card">
      <img src={image} alt={title} className="event-image" />

      <div className="event-card-content">
        <h3>{title}</h3>

        <p>
          <strong>Date:</strong> {date}
        </p>

        <p>
          <strong>Time:</strong> {time}
        </p>

        <p>
          <strong>Location:</strong> {location}
        </p>

        <p className="event-notes">{notes}</p>

        <Link to={buttonLink} className="event-card-btn">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

export default EventCard;