import React, { useRef, useEffect, useState } from "react";
import "../../cssFiles/TrailerCarousel.css";

const TrailerCarousel = ({ trailers }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollTimeout = useRef(null);

  const updateActiveItem = () => {
    const container = scrollRef.current;
    if (!container) return;

    const items = container.querySelectorAll(".carousel-item");
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    items.forEach((item, index) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(containerCenter - itemCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  const scrollByCard = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const items = container.querySelectorAll(".carousel-item");
    const newIndex =
      direction === "left"
        ? Math.max(activeIndex - 1, 0)
        : Math.min(activeIndex + 1, items.length - 1);

    const targetItem = items[newIndex];
    if (!targetItem) return;

    container.scrollTo({
      left:
        targetItem.offsetLeft -
        container.offsetWidth / 2 +
        targetItem.offsetWidth / 2,
      behavior: "smooth",
    });

    // NO setActiveIndex here
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        updateActiveItem();
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    updateActiveItem();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <div className="trailer-carousel-wrapper">
      <button className="arrow left" onClick={() => scrollByCard("left")}>
        &#10094;
      </button>

      <div className="trailer-carousel-container" ref={scrollRef}>
        {trailers.map((trailer, index) => (
          <div
            className={`carousel-item ${index === activeIndex ? "active" : ""}`}
            key={index}
          >
            <iframe
              className="trailer-video"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ))}
      </div>

      <button className="arrow right" onClick={() => scrollByCard("right")}>
        &#10095;
      </button>
    </div>
  );
};

export default TrailerCarousel;
