import { useEffect, useState } from "react";
import "./EventCountdown.css";
function EventCountdown() {
  const eventDate = new Date("July 25, 2026 19:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = eventDate - now;
      if (distance <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);
  return (
    <section className="countdown-teaser">
      <div className="countdown-text">
        <p>Next Up</p>
        <h2>Summer Concert</h2>
        <span>July 25, 2026 at 7:00 PM</span>
      </div>
      <div className="countdown-numbers">
        <div>
          <strong>{timeLeft.days}</strong>
          <span>Days</span>
        </div>
        <div>
          <strong>{timeLeft.hours}</strong>
          <span>Hours</span>
        </div>
        <div>
          <strong>{timeLeft.minutes}</strong>
          <span>Minutes</span>
        </div>
        <div>
          <strong>{timeLeft.seconds}</strong>
          <span>Seconds</span>
        </div>
      </div>
      <a href="/events" className="countdown-link">
        View Events
      </a>
    </section>
  );
}
export default EventCountdown;