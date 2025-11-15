import { Link } from "react-router-dom"

export function GameCard({ game, variant = "default", className = "" }) {
  return (
    <>
    { game &&
    <Link to={`/games/${game._id}`} className={`block ${className}`}>
      <div className="game-card">
        <div className="game-card-image">
          <img src={game?.coverImage || "/game-cover.jpeg"} alt={game.title} />
          <div className="game-card-overlay"></div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {variant === "featured" && <span className="badge">Featured</span>}
        </div>

        {/* Like button */}
        <button className="game-card-like">
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
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Game info */}
        <div className="game-card-content">
          {variant === "featured" || variant === "default" ? (
            <>
              <div className="game-card-badges">
                {game.genre?.map((g, i) => (
                  <span className="badge" style={{ fontSize: "10px" }} key={i}>
                    {g}
                  </span>
                ))}
              </div>
              <h3 className={`game-card-title ${variant === "featured" ? "text-xl" : "text-base"}`}>{game.title}</h3>
              <div className="game-card-footer">
                <div className="rating">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#111', background: 'rgba(255,255,255,0.85)', padding: '2px 8px', borderRadius: '6px' }}>
                    {game?.rating ?? 0}
                  </span>
                </div>
                <span className="text-xs text-white/70">
                  {game.released ? (typeof game.released === "string" ? game.released.slice(0, 4) : new Date(game.released).getFullYear()) : ""}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <h3 className="game-card-title text-sm line-clamp-1">{game.title}</h3>
              <div className="rating">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span className="text-xs font-medium text-white">{game.rating !== undefined && game.rating !== null ? game.rating.toFixed(1) : "0"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
    }
    </>
  )
}
