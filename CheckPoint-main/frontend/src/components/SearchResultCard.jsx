import { Link } from "react-router-dom"

export function SearchResultCard({ game, className = "" }) {
  if (!game) return null

  return (
    <Link to={`/games/${game._id}`} className={`block ${className}`}>
      <div className="flex bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-900/70 transition-colors duration-200 border border-gray-800/50">
        {/* Cover Image */}
        <div className="flex-shrink-0 w-24 h-32 sm:w-32 sm:h-40">
          <img src={game?.coverImage || "/game-cover.jpeg"} alt={game.title} className="w-full h-full object-cover" />
        </div>

        {/* Game Details */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          {/* Title */}
          <div className="mb-2">
            <h3 className="text-white font-semibold text-lg line-clamp-2 leading-tight">{game.title}</h3>
          </div>

          {/* Release Date */}
          <div className="mb-2">
            <span className="text-gray-400 text-sm">
              Released:{" "}
              {game.released
                ? typeof game.released === "string"
                  ? game.released.slice(0, 4)
                  : new Date(game.released).getFullYear()
                : "Unknown"}
            </span>
          </div>

          {/* Genre Tags */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {game.genre?.map((g, i) => (
                <span
                  key={i}
                  className="inline-block bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-600/30"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1.5">
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
              <span className="text-white font-medium text-sm">{game.rating?.toFixed(1) ?? "N/A"}</span>
            </div>
            <span className="text-gray-400 text-sm ml-1">/ 5.0</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
