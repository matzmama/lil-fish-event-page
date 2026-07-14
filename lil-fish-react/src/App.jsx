import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import EventsPage from "./Pages/EventsPage";
import Gallery from "./Pages/Gallery";
import ContactPage from "./Pages/ContactPage";

import "./App.css";

function App() {
  const [season, setSeason] = useState("classic-theme");

  return (
    <Router>
      <div className={`app ${season}`}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                season={season}
                setSeason={setSeason}
              />
            }
          />

          <Route
            path="/home"
            element={
              <Home
                season={season}
                setSeason={setSeason}
              />
            }
          />

          <Route
            path="/about"
            element={
              <About
                season={season}
                setSeason={setSeason}
              />
            }
          />

          <Route
            path="/events"
            element={
              <EventsPage
                season={season}
                setSeason={setSeason}
              />
            }
          />

          <Route
            path="/gallery"
            element={
              <Gallery
                season={season}
                setSeason={setSeason}
              />
            }
          />

          <Route
            path="/contact"
            element={
              <ContactPage
                season={season}
                setSeason={setSeason}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;