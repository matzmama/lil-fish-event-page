import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ActionButtons from "./components/ActionButtons";
import EventCard from "./components/EventCard";
import RentalCard from "./components/RentalCard";
import CustomPackages from "./components/CustomPackages";
import Footer from "./components/Footer";

import harvestFestival from "./assets/lil fish harvest festival.png";
import bandPhoto from "./assets/band1.png";
import holidayMarket from "./assets/Lil Fish Holiday market.png";

import weddingPhoto from "./assets/wedding1.png";
import reunionPhoto from "./assets/plain lil fish photo.png";
import graduationPhoto from "./assets/graduation.png";
import anniversaryPhoto from "./assets/anniversary.png";

function App() {

    const events = [

        {
            title: "Spring Festival",
            image: harvestFestival,
            date: "April 12, 2026",
            time: "9:00 AM",
            location: "Community Center Grounds",
            notes: "Family activities, vendors, food trucks, and live music."
        },

        {
            title: "Summer Concert",
            image: bandPhoto,
            date: "July 25, 2026",
            time: "7:00 PM",
            location: "Outdoor Amphitheater",
            notes: "Live performance featuring the Summer Jam Band."
        },

        {
            title: "Holiday Market",
            image: holidayMarket,
            date: "December 3, 2026",
            time: "10:00 AM",
            location: "Main Hall",
            notes: "Local crafts, holiday gifts, seasonal treats, and community vendors."
        }

    ];

    return (

        <div className="events-page">

            <Navbar />

            <Hero />

            <ActionButtons />

            <section className="events-banner">

                <h2>
                    Upcoming Events
                </h2>

                <p>
                    Join us for concerts, festivals, markets,
                    weddings, and community celebrations throughout the year.
                </p>

            </section>

            <div className="event-grid">

                {events.map((event) => (

                    <EventCard
                        key={event.title}
                        image={event.image}
                        title={event.title}
                        date={event.date}
                        time={event.time}
                        location={event.location}
                        notes={event.notes}
                    />

                ))}

            </div>

            <section className="rentals-section">

                <h2>
                    Venue Rentals
                </h2>

                <div className="rental-grid">

                    <RentalCard
                        image={weddingPhoto}
                        title="Wedding Venue"
                        description="Elegant indoor and outdoor spaces for weddings and receptions."
                    />

                    <RentalCard
                        image={reunionPhoto}
                        title="Family Reunions"
                        description="Large gathering spaces perfect for family celebrations."
                    />

                    <RentalCard
                        image={graduationPhoto}
                        title="Graduations"
                        description="Celebrate academic achievements with friends and family."
                    />

                    <RentalCard
                        image={anniversaryPhoto}
                        title="Anniversaries"
                        description="Create lasting memories for milestone anniversary celebrations."
                    />

                </div>

            </section>

            <CustomPackages />

            <Footer />

        </div>

    );

}

export default App;