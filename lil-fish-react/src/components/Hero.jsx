import "./Hero.css";
import venuePhoto from "../assets/plain lil fish photo.png";


function Hero() {


    return (


        <section
            className="hero"
            style={{
                backgroundImage: `url(${venuePhoto})`
            }}
        >


            <div className="hero-overlay">


                <h1>
                    Celebrate Life's Biggest Moments
                </h1>


                <p>
                    Weddings, concerts, retirement parties,
                    graduations, seasonal festivals,
                    and unforgettable community events.
                </p>


            </div>


        </section>


    );


}


export default Hero;


