import { Link } from "react-router-dom";
import "./RentalCard.css";

function RentalCard({
  image,
  title,
  description,
  buttonText = "Request Information",
  buttonLink = "/contact",
}) {
  return (
    <div className="rental-card">
      <img src={image} alt={title} className="rental-image" />

      <h3>{title}</h3>

      <p>{description}</p>

      <Link to={buttonLink} className="rental-card-btn">
        {buttonText}
      </Link>
    </div>
  );
}

export default RentalCard;