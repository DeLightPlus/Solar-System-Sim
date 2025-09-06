// src/components/SolarIntroTutorial/SolarIntroTutorial.jsx
import React, { useState, useEffect } from "react";
import "./SolarIntroTutorial.css"; // create this stylesheet for styling

const slides = [
  {
    title: "What is a Solar System?",
    image: "/placeholder1.png", // Replace with real assets later
    description:
      "A solar system is a star and everything bound to it by gravity — planets, moons, comets, asteroids, dust, and more. Ours orbits the Sun.",
  },
  {
    title: "Why is it called the Solar System?",
    image: "/placeholder2.png",
    description:
      "Because 'Sol' is the Latin name for our Sun. Other star systems are simply called 'star systems'.",
  },
  {
    title: "What is a Planet?",
    image: "/placeholder3.png",
    description:
      "A planet is a celestial body that orbits a star, is massive enough to be rounded by its own gravity, and clears its orbital path.",
  },
  {
    title: "How Many Planets Are There?",
    image: "/placeholder4.png",
    description:
      "There are 8 recognized planets in our solar system — from Mercury to Neptune.",
  },
  {
    title: "What’s Beyond the Solar System?",
    image: "/placeholder5.png",
    description:
      "Billions of stars like our Sun — many with their own planetary systems. These are called exoplanets.",
  },
  {
    title: "You're Ready to Explore",
    image: "/placeholder6.png",
    description:
      "You can now interact with the planets. Click any planet to learn more about it!",
  },
];

export default function SolarIntroTutorial({ onFinish }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden"; // prevent background scrolling
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    onFinish(); // triggers re-enable of interactivity in parent
  };

  const { title, description, image } = slides[currentSlide];

  return (
    <div className="solar-tutorial-overlay">
      <div className="solar-tutorial-card">
        <img src={image} alt={title} className="tutorial-image" />
        <h2>{title}</h2>
        <p>{description}</p>

        <div className="tutorial-controls">
          <button onClick={prevSlide} disabled={currentSlide === 0}>
            ◀ Back
          </button>

          {currentSlide === slides.length - 1 ? (
            <button onClick={handleFinish}>Finish & Explore</button>
          ) : (
            <button onClick={nextSlide}>Next ▶</button>
          )}
        </div>

        {/* Optional Progress Dots */}
        <div className="progress-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={i === currentSlide ? "dot active" : "dot"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
