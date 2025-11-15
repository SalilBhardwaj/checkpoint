"use client"
import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { GameCard } from "./GameCard"

export function GameCarousel({ title, Tab = "/games", games = [], variant = "default", className = "" }) {
  const navigate = useNavigate();
  // console.log("games",games);
  const carouselRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (!carouselRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScrollButtons()
    window.addEventListener("resize", checkScrollButtons)
    return () => window.removeEventListener("resize", checkScrollButtons)
  }, [])

  const scroll = (direction) => {
    if (!carouselRef.current) return

    const scrollAmount =
      direction === "left" ? -carouselRef.current.clientWidth / 2 : carouselRef.current.clientWidth / 2

    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })

    // Update button states after scrolling
    setTimeout(checkScrollButtons, 400)
  }

  return (
    <div className={`game-carousel ${className}`}>
      <div className="game-carousel-header">
        <h2 className="game-carousel-title">{title}</h2>
        {Tab && (
          <button 
          onClick={()=> navigate('/games', {state: { activeTab : Tab}})}
          className="game-carousel-link group">
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        )}
      </div>

      <div className="game-carousel-container">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button className="game-carousel-arrow game-carousel-arrow-left" onClick={() => scroll("left")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <button className="game-carousel-arrow game-carousel-arrow-right" onClick={() => scroll("right")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}

        {/* Carousel */}
        <div ref={carouselRef} className="game-carousel-scroll scrollbar-hidden" onScroll={checkScrollButtons}>
          {games.map((game) => (
            <div key={game.id} className={`game-carousel-item ${variant === "featured" ? "featured" : "default"}`}>
              <GameCard game={game} variant={variant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
