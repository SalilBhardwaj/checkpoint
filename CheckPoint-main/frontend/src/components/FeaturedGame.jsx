import { useState } from "react"
import { Link } from "react-router-dom"// Import the CSS file for styling

export function FeaturedGame() {
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false)

  const handleWishlistClick = () => {
    setIsAddedToWishlist((prevState) => !prevState) // Toggle the state
  }

  return (
    <div className="featured-game">
      <div className="featured-game-image hover-effect">
        <img src="/game-cover.jpeg" alt="Featured game" />
      </div>
      <div className="featured-game-overlay"></div>

      <div className="featured-game-content">
        <span className="badge featured-game-badge">FEATURED GAME</span>
        <h2 className="featured-game-title">
          The Last of<span className="text-gradient"> Us</span>
        </h2>

        <div className="featured-game-meta">
          <div className="rating">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#FBBF24"
              stroke="#FBBF24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="font-medium" style={{ color: '#111', background: 'rgba(255,255,255,0.85)', padding: '2px 8px', borderRadius: '6px' }}>{/* force dark text on light bg */}
              4.8
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-white/70 text-sm">Release: Dec 2023</span>
          </div>
        </div>

        <p className="featured-game-description">
          Embark on an epic journey across the cosmos in this groundbreaking space RPG. Explore uncharted worlds, forge
          alliances with alien civilizations, and uncover the mysteries of an ancient galactic threat.
        </p>

        <div className="featured-game-actions">
          <Link to="/games">
            <button className="btn btn-neon group px-6 py-3">
              View Now
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
                className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </Link>
          <button
            className={`btn px-6 py-3 ${
              isAddedToWishlist ? "bg-green-500 text-white" : "btn-outline"
            }`}
            onClick={handleWishlistClick}
          >
            {isAddedToWishlist ? "Added to Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  )
}