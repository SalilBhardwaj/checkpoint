import React, { useState, useEffect } from "react";
import { MainNav } from "../components/MainNav";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, X, Calendar, Tag } from "lucide-react";

export default function ReviewsRating() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [formData, setFormData] = useState({
    reviewText: "",
    rating: 0,
    liked: false,
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [game, setGame] = useState(null);
  const [gameLoading, setGameLoading] = useState(true);
  const [gameError, setGameError] = useState("");

  useEffect(() => {
    async function fetchGame() {
      setGameLoading(true);
      setGameError("");
      try {
        const res = await fetch(`${baseUrl}/games/${id}`);
        const data = await res.json();
        if (!res.ok || data.error || !data.game) {
          setGameError(data.error || "Game not found");
          setGame(null);
        } else {
          setGame(data.game);
        }
      } catch (err) {
        setGameError("Failed to load game details.");
        setGame(null);
      }
      setGameLoading(false);
    }
    fetchGame();
  }, [id, baseUrl]);

  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() && formData.tags.length < 5) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rating || !formData.reviewText.trim()) {
      setError("Please provide a rating and a review.");
      return;
    }
    setError("");
    try {
      const res = await fetch(`${baseUrl}/review/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          rating: formData.rating,
          reviewText: formData.reviewText,
          liked: formData.liked,
          tags: formData.tags,
        }),
      });
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to submit review.");
        return;
      }
      setSubmitted(true);
      setTimeout(() => {
        navigate(`/games/${id}`);
      }, 1200); // short delay for user feedback
    } catch (err) {
      setError("Failed to submit review.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="fixed top-0 left-0 w-full z-50">
        <MainNav />
      </div>
      <div className="max-w-4xl mx-auto space-y-8" style={{ marginTop: 80 }}>
        {/* Game Detail Card */}
        <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-purple-500/20 hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-300">
          {gameLoading ? (
            <div className="text-center text-gray-400">
              Loading game details...
            </div>
          ) : gameError ? (
            <div className="text-center text-red-400">{gameError}</div>
          ) : game ? (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Game Image */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <img
                    src={game?.coverImage || "/placeholder.svg"}
                    alt={game.name}
                    className="w-full lg:w-64 h-48 lg:h-36 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              {/* Game Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {game?.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-300 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(game?.released)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {game?.rating}/5
                      </span>
                    </div>
                  </div>
                  {/* Genre Badges */}
                  <div className="flex flex-wrap gap-2">
                    {game?.genre &&
                      game?.genre.map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded-full shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-200"
                        >
                          {genre.toUpperCase()}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {/* Review Form */}
        <div className="bg-gradient-to-br from-slate-800/60 to-purple-800/40 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Tag className="w-6 h-6 text-purple-400" />
            Write a Review
          </h2>
          {submitted ? (
            <div className="text-green-400 text-center font-semibold">
              Thank you for your review!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Review Text */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Your Review
                </label>
                <textarea
                  value={formData.reviewText}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reviewText: e.target.value,
                    }))
                  }
                  placeholder="Share your thoughts about this game..."
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  required
                />
              </div>
              {/* Rating */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 transition-transform duration-150 hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors duration-200 ${
                          star <= (hoveredStar || formData.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-500 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              {/* Liked Toggle */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">
                  Recommendation
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, liked: !prev.liked }))
                  }
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    formData?.liked
                      ? "bg-gradient-to-r from-pink-600/20 to-red-600/20 border-pink-500/50 text-pink-200"
                      : "bg-slate-700/30 border-gray-600/50 text-gray-300 hover:border-pink-500/30"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-all duration-200 ${
                      formData?.liked
                        ? "fill-pink-400 text-pink-400"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">
                    {formData?.liked ? "Recommended" : "Click to recommend"}
                  </span>
                </button>
              </div>
              {/* Tags */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">
                  Tags ({formData.tags.length}/5)
                </label>
                {/* Tag Input */}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags (press Enter)"
                  disabled={formData.tags.length >= 5}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {/* Tag Display */}
                {formData?.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData?.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-full shadow-lg"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors duration-150"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Error Message */}
              {error && <div className="text-red-400 text-sm">{error}</div>}
              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={
                    !formData?.reviewText.trim() || formData?.rating === 0
                  }
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
