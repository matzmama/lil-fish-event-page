import { useState } from "react"; 

import { NavLink } from "react-router-dom"; 

import { FaBars, FaTimes } from "react-icons/fa"; 

  

import SeasonSelector from "./SeasonSelector"; 

  

import "./Navbar.css"; 

  

function Navbar({ season, setSeason }) { 

  const [menuOpen, setMenuOpen] = useState(false); 

  

  function getNavLinkClass({ isActive }) { 

    return isActive 

      ? "navbar-link active-navbar-link" 

      : "navbar-link"; 

  } 

  

  function closeMenu() { 

    setMenuOpen(false); 

  } 

  

  return ( 

    <nav className="navbar"> 

      <div className="navbar-top-row"> 

        <NavLink 

          to="/" 

          className="navbar-logo" 

          onClick={closeMenu} 

        > 

          LIL FISH COMMUNITY CENTER 

        </NavLink> 

  

        <button 

          type="button" 

          className="navbar-menu-btn" 

          onClick={() => 

            setMenuOpen((previousValue) => !previousValue) 

          } 

          aria-label={ 

            menuOpen 

              ? "Close navigation menu" 

              : "Open navigation menu" 

          } 

          aria-expanded={menuOpen} 

          aria-controls="primary-navigation" 

        > 

          {menuOpen ? <FaTimes /> : <FaBars />} 

        </button> 

      </div> 

  

      <div 

        id="primary-navigation" 

        className={ 

          menuOpen 

            ? "navbar-right navbar-right-open" 

            : "navbar-right" 

        } 

      > 

        <ul className="navbar-links"> 

          <li> 

            <NavLink 

              to="/" 

              end 

              className={({ isActive }) => 

                isActive 

                  ? "navbar-link active-navbar-link" 

                  : "navbar-link" 

              } 

              onClick={closeMenu} 

            > 

              Home 

            </NavLink> 

          </li> 

  

          <li> 

            <NavLink 

              to="/about" 

              className={getNavLinkClass} 

              onClick={closeMenu} 

            > 

              About 

            </NavLink> 

          </li> 

  

          <li> 

            <NavLink 

              to="/events" 

              className={getNavLinkClass} 

              onClick={closeMenu} 

            > 

              Events 

            </NavLink> 

          </li> 

  

          <li> 

            <NavLink 

              to="/gallery" 

              className={getNavLinkClass} 

              onClick={closeMenu} 

            > 

              Gallery 

            </NavLink> 

          </li> 

  

          <li> 

            <NavLink 

              to="/contact" 

              className={getNavLinkClass} 

              onClick={closeMenu} 

            > 

              Contact 

            </NavLink> 

          </li> 

        </ul> 

  

        <SeasonSelector 

          season={season} 

          setSeason={setSeason} 

        /> 

      </div> 

    </nav> 

  ); 

} 

  

export default Navbar; 