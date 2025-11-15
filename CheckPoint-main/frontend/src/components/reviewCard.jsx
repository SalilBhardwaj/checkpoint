import { Star, Heart, Calendar, User, Tag } from "lucide-react"

// Mini GameCard component for the review card
import { GameCard } from "./GameCard"

export default function ReviewCard({ review }) {
  if (!review) return null

  const formatDate = (date) => {
    if (!date) return ""
    const reviewDate = new Date(date)
    return reviewDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating || 0)
    const hasHalfStar = (rating || 0) % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />)
      }
    }
    return stars
  }

  return (
    <div className="bg-gray-700 rounded-xl shadow-md border border-gray-800 p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex gap-4">
        {/* Game Card - Left Side */}
        <GameCard game={review.game} className="w-32 h-40 flex-shrink-0" />

        {/* Review Details - Right Side */}
        <div className="flex-1 min-w-0">
          {/* Header with game title and rating */}
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{review.game?.title || "Unknown Game"}</h3>
              {review.game?.genre && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {review.game.genre.slice(0, 2).map((genre, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Like button */}
            <button className="ml-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <Heart
                className={`w-5 h-5 ${review.liked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
              />
            </button>
          </div>

          {/* Rating */}
          {typeof review.rating === "number" && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
              <span className="text-sm font-medium text-gray-700">{review.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Review Text */}
          {review.reviewText && (
            <p className="text-white text-sm leading-relaxed mb-3 line-clamp-3">{review.reviewText}</p>
          )}

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {review.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer with user and date */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{review.createdBy?.username || review.createdBy?.name || "Anonymous"}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}