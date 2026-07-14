import {
  FaHome,
  FaLeaf,
  FaSeedling,
  FaSnowflake,
  FaSun,
} from "react-icons/fa";

import "./SeasonSelector.css";

function SeasonSelector({ season, setSeason }) {
  const themes = [
    {
      className: "classic-theme",
      label: "Classic Lil Fish",
      icon: <FaHome />,
    },
    {
      className: "spring-theme",
      label: "Spring",
      icon: <FaSeedling />,
    },
    {
      className: "summer-theme",
      label: "Summer",
      icon: <FaSun />,
    },
    {
      className: "fall-theme",
      label: "Fall",
      icon: <FaLeaf />,
    },
    {
      className: "winter-theme",
      label: "Winter",
      icon: <FaSnowflake />,
    },
  ];

  const currentTheme =
    themes.find((theme) => theme.className === season) || themes[0];

  function handleThemeChange() {
    const currentIndex = themes.findIndex(
      (theme) => theme.className === season
    );

    const nextIndex = (currentIndex + 1) % themes.length;

    setSeason(themes[nextIndex].className);
  }

  return (
    <button
      type="button"
      className="season-toggle-btn"
      onClick={handleThemeChange}
      aria-label={`Current mode: ${currentTheme.label}. Click to change season.`}
      title={`${currentTheme.label} Mode`}
    >
      <span className="season-icon">
        {currentTheme.icon}
      </span>
    </button>
  );
}

export default SeasonSelector;