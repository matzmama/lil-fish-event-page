import { Link } from "react-router-dom"; 

  

import "./InteractiveHero.css"; 

  

function InteractiveHero() { 

  return ( 

    <section className="interactive-hero"> 

      <div className="interactive-hero-overlay"> 

        <div className="interactive-hero-content"> 

          <p className="interactive-hero-kicker"> 

            Lil Fish Community Center 

          </p> 

  

          <h1> 

            Small-Town Traditions. 

            <span> Modern Community Experiences.</span> 

          </h1> 

  

          <p className="interactive-hero-text"> 

            From weddings and festivals to concerts, markets, and milestone 

            celebrations, Lil Fish is where community memories are made. 

          </p> 

  

          <div className="interactive-hero-actions"> 

            <Link 

              to="/events" 

              className="interactive-hero-btn interactive-hero-primary" 

            > 

              Explore Events 

            </Link> 

  

            <Link 

              to="/contact?type=custom-event" 

              className="interactive-hero-btn interactive-hero-secondary" 

            > 

              Book the Venue 

            </Link> 

          </div> 

        </div> 

  

        <div className="interactive-hero-scroll" aria-hidden="true"> 

          <span>Scroll</span> 

  

          <div className="interactive-scroll-line"></div> 

        </div> 

      </div> 

    </section> 

  ); 

} 

  

export default InteractiveHero;