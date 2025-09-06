import React from "react";
import "./PlanetCard.css";

export default function PlanetCard({ planet, onSelect }) {
  const imagePath = `/images/planets/${planet.name.toLowerCase()}.png`; // adjust path as needed

  return (
    <div className="planet-card" onClick={() => onSelect(planet)}>
      <img
        src={imagePath}
        alt={planet.name}
        className="planet-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/vite.svg"; // fallback
        }}
      />
      <p className="planet-name">{planet.name}</p>
      <p className="planet-description">{planet.description}</p>
      {/* <p>Radius: {planet.radius} km</p>
      <p>Distance: {planet.distance} AU</p>
      <p>Moons: {planet.moons.length}</p> */}
    </div>
  );
}
