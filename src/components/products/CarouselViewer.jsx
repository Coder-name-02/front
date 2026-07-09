"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function CarouselViewer() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch(`${API_URL}/api/v1/carousel_images`);
        if (res.ok) {
          const data = await res.json();
          setSlides(data);
        }
      } catch (err) {
        console.error("Failed to fetch carousel slides:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0 && typeof window !== "undefined") {
      const initCarousel = () => {
        if (window.bootstrap && window.bootstrap.Carousel) {
          const el = document.getElementById("homepageCarousel");
          if (el) {
            new window.bootstrap.Carousel(el, { interval: 5000, ride: "carousel" });
          }
        } else {
          // Retry if bootstrap hasn't loaded yet
          setTimeout(initCarousel, 50);
        }
      };
      initCarousel();
    }
  }, [slides]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-light w-100" style={{ height: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null; // Don't render anything if no active slides
  }

  return (
    <div id="homepageCarousel" className="carousel slide carousel-fade mb-5" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#homepageCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Inner */}
      <div className="carousel-inner" style={{ borderRadius: "16px", overflow: "hidden" }}>
        {slides.map((slide, index) => {
          const SlideImage = (
            <img
              src={slide.image_url}
              className="d-block w-100 object-fit-fill"
              style={{ height: "400px", minHeight: "300px" }}
              alt={`Slide ${index + 1}`}
            />
          );

          return (
            <div key={slide.id} className={`carousel-item ${index === 0 ? "active" : ""}`} data-bs-interval="5000">
              {slide.link_url ? (
                <Link href={slide.link_url} className="d-block">
                  {SlideImage}
                </Link>
              ) : (
                SlideImage
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button className="carousel-control-prev" type="button" data-bs-target="#homepageCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#homepageCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}
    </div>
  );
}
