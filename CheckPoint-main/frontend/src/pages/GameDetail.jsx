"use client";

import { useRef, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MainNav } from "../components/MainNav";
import Footer from "../components/Footer";
import ReviewComponent from "../components/reviewComponent";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Edit3,
  Clock,
  Trophy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Monitor,
  Gamepad2,
  Smartphone,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

// Sample/mock data for fallback
const sampleGameData = {
  _id: "67fb9ce69f74254e00519261",
  id: 3498,
  title: "Grand Theft Auto V",
  released: "2013-09-17",
  rating: 4.47,
  coverImage:
    "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
  playTime: 74,
  platforms: ["PC", "PlayStation 4", "Xbox One", "PlayStation 5"],
  genre: ["Action", "Adventure", "Crime"],
  description:
    "<p>Rockstar Games went bigger, since their previous installment of the series. You get the complicated and realistic world to explore, filled with gangs and corruption from all sides. You play as three characters at once.</p><p>Michael, ex-criminal living his life of leisure in Los Santos, occasionally hanging out with his family, Franklin, a kid that seeks the better future, and Trevor, the exact past Michael is trying to escape from. Their stories intertwine, as Michael owes a lot of money to some really bad people.</p>",
  metacritic: 92,
  ratings_count: 7101,
  website: "http://www.rockstargames.com/V/",
  screenshots: [
    {
      id: 1,
      url: "/placeholder.svg?height=400&width=600",
      caption: "Los Santos cityscape",
      type: "image",
    },
    {
      id: 2,
      url: "/placeholder.svg?height=400&width=600",
      caption: "Character selection screen",
      type: "image",
    },
    {
      id: 3,
      url: "/placeholder.svg?height=400&width=600",
      caption: "Gameplay trailer",
      type: "video",
    },
    {
      id: 4,
      url: "/placeholder.svg?height=400&width=600",
      caption: "Mission gameplay",
      type: "image",
    },
    {
      id: 5,
      url: "/placeholder.svg?height=400&width=600",
      caption: "Vehicle customization",
      type: "image",
    },
    {
      id: 6,
      url: "/placeholder.svg?height=400&width=600",
      caption: "Multiplayer mode",
      type: "image",
    },
  ],
  reviews: [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      text: "Absolutely incredible game! The open world is massive and there's always something to do. The story is engaging and the characters are well-developed.",
      likes: 24,
      tags: ["masterpiece", "open-world", "story"],
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      user: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      text: "Great game with amazing graphics and gameplay. Some missions can be repetitive but overall a fantastic experience.",
      likes: 18,
      tags: ["graphics", "gameplay"],
      createdAt: "2024-01-10",
    },
  ],
  similarGames: [
    {
      id: 1,
      title: "Red Dead Redemption 2",
      coverImage: "/placeholder.svg?height=200&width=150",
      rating: 4.6,
      genre: ["Action", "Adventure"],
    },
    {
      id: 2,
      title: "Watch Dogs 2",
      coverImage: "/placeholder.svg?height=200&width=150",
      rating: 4.2,
      genre: ["Action", "Hacking"],
    },
    {
      id: 3,
      title: "Cyberpunk 2077",
      coverImage: "/placeholder.svg?height=200&width=150",
      rating: 3.8,
      genre: ["RPG", "Sci-Fi"],
    },
  ],
};

const ratingDistribution = [
  { rating: 5, count: 3200, percentage: 45 },
  { rating: 4, count: 2130, percentage: 30 },
  { rating: 3, count: 1065, percentage: 15 },
  { rating: 2, count: 426, percentage: 6 },
  { rating: 1, count: 280, percentage: 4 },
];

const platformPrices = {
  PC: { price: "₹1,499", platform: "Steam" },
  "PlayStation 4": { price: "₹1,999", platform: "PS Store" },
  "Xbox One": { price: "₹1,799", platform: "Xbox Store" },
  "PlayStation 5": { price: "₹2,499", platform: "PS Store" },
  "Nintendo Switch": { price: "₹2,999", platform: "Nintendo eShop" },
  "Xbox Series X": { price: "₹2,799", platform: "Xbox Store" },
  "Xbox Series S": { price: "₹2,299", platform: "Xbox Store" },
  macOS: { price: "₹1,299", platform: "Mac App Store" },
  Linux: { price: "₹999", platform: "Steam" },
  Android: { price: "₹499", platform: "Google Play" },
  iOS: { price: "₹599", platform: "App Store" },
};

const GameDetailSkeleton = () => (
  <div className="min-h-screen bg-slate-900">
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
        <div className="w-64 h-80 bg-slate-700/50 rounded-2xl animate-pulse" />
        <div className="flex-1 space-y-4">
          <div className="h-12 bg-slate-700/50 rounded-lg animate-pulse" />
          <div className="h-6 bg-slate-700/50 rounded-lg animate-pulse w-32" />
          <div className="h-8 bg-slate-700/50 rounded-lg animate-pulse w-64" />
          <div className="flex gap-4">
            <div className="h-12 bg-slate-700/50 rounded-xl animate-pulse w-32" />
            <div className="h-12 bg-slate-700/50 rounded-xl animate-pulse w-40" />
          </div>
        </div>
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-slate-800/50 rounded-2xl p-6 mb-8">
          <div className="h-8 bg-slate-700/50 rounded-lg animate-pulse w-48 mb-6" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-700/50 rounded animate-pulse" />
            <div className="h-4 bg-slate-700/50 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-slate-700/50 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function GameDetail() {
  const aboutRef = useRef(null);
  const reviewsRef = useRef(null);
  const listsRef = useRef(null);
  const statsRef = useRef(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  // UI state for advanced UI
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [autoScrollInterval, setAutoScrollInterval] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      setApiError(false);
      try {
        const gameRes = await fetch(`${baseUrl}/games/${id}`);
        const gameData = await gameRes.json();
        if (!ignore && gameData && gameData.game) {
          setGame(gameData.game);
        } else {
          setGame(null);
        }
        // Fetch reviews
        const reviewRes = await fetch(`${baseUrl}/games/${id}/reviews`);
        const reviewData = await reviewRes.json();
        if (!ignore && reviewData && reviewData.reviews) {
          // Sort reviews by date (latest first) and filter out any empty reviews
          const sortedReviews = reviewData.reviews
            .filter((review) => review && review.createdBy) // Filter out empty reviews
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setReviews(sortedReviews);
          setReviewsLoaded(true);
        } else {
          setReviews([]);
          setReviewsLoaded(true);
        }
      } catch (e) {
        setApiError(true);
        setGame(null);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [id, baseUrl]);

  // Check if user is logged in and fetch game status
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setIsWishlisted(false);
      setIsPlayed(false);
      return;
    }

    let ignore = false;
    async function fetchGameStatus() {
      try {
        // Check if game is wishlisted
        const wishlistRes = await fetch(
          `${baseUrl}/wishlist/isWishlisted/${id}`,
          {
            credentials: "include",
          }
        );
        if (!ignore && wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          setIsWishlisted(wishlistData.isWishlisted);
        }

        // Check if game is played (has review)
        const playedRes = await fetch(`${baseUrl}/review/isPlayed/${id}`, {
          credentials: "include",
        });
        console.log(playedRes);
        if (!ignore && playedRes.ok) {
          const playedData = await playedRes.json();
          setIsPlayed(playedData.isPlayed);
        }
      } catch (e) {
        console.error("Error fetching game status:", e);
      }
    }

    fetchGameStatus();
    return () => {
      ignore = true;
    };
  }, [id, baseUrl]);

  // Wishlist handler
  const handleWishlist = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/wishlist/${isWishlisted ? "remove" : "add"}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: id }),
        }
      );

      if (response.ok) {
        setIsWishlisted((prev) => !prev);
      }
    } catch (e) {
      console.error("Error updating wishlist:", e);
    }
  };

  // Handler functions for ReviewCard
  const handleUserClick = (userId) => {
    // Navigate to user profile
    navigate(`/profile/${userId}`);
  };

  const handleGameClick = (gameId) => {
    // Navigate to game detail
    navigate(`/games/${gameId}`);
  };

  // Scroll helpers
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper functions for UI
  const getPlatformIcon = (platform) => {
    if (platform.includes("PC")) return <Monitor className="w-4 h-4" />;
    if (platform.includes("PlayStation"))
      return <Gamepad2 className="w-4 h-4" />;
    if (platform.includes("Xbox")) return <Gamepad2 className="w-4 h-4" />;
    return <Smartphone className="w-4 h-4" />;
  };
  const formatDate = (dateString) => new Date(dateString).getFullYear();
  const renderStars = (rating, size = "w-4 h-4") => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };
  const pauseAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      setAutoScrollInterval(null);
    }
  };

  const resumeAutoScroll = () => {
    if (
      gameData?.screenshots &&
      gameData.screenshots.length > 1 &&
      !autoScrollInterval
    ) {
      const interval = setInterval(() => {
        setCurrentScreenshot(
          (prev) => (prev + 1) % gameData.screenshots.length
        );
      }, 3000);
      setAutoScrollInterval(interval);
    }
  };

  const nextScreenshot = (screenshots) => {
    pauseAutoScroll();
    setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(resumeAutoScroll, 5000);
  };

  const prevScreenshot = (screenshots) => {
    pauseAutoScroll();
    setCurrentScreenshot(
      (prev) => (prev - 1 + screenshots.length) % screenshots.length
    );
    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(resumeAutoScroll, 5000);
  };

  // Use API data if available, otherwise fallback to sample data
  const gameData = game
    ? {
        ...sampleGameData,
        ...game,
        reviews: reviews.length > 0 ? reviews : sampleGameData.reviews,
      }
    : { ...sampleGameData };

  // Auto-scroll screenshots
  useEffect(() => {
    if (gameData?.screenshots && gameData.screenshots.length > 1) {
      const interval = setInterval(() => {
        setCurrentScreenshot(
          (prev) => (prev + 1) % gameData.screenshots.length
        );
      }, 3000); // Change screenshot every 3 seconds

      setAutoScrollInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [gameData?.screenshots]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };
  }, [autoScrollInterval]);

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <MainNav />
        <div className="flex-1 flex items-center justify-center">
          <GameDetailSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  // Main UI between header and footer
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MainNav />
      <div className="flex-1">
        {/* --- Advanced UI Start --- */}
        <div className="min-h-screen bg-slate-900">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden"
          >
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
              <img
                src={gameData?.coverImage || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-cover blur-3xl opacity-20 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Cover Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex-shrink-0"
                >
                  <div className="relative group">
                    <img
                      src={gameData?.coverImage || "/placeholder.svg"}
                      alt={gameData?.title}
                      className="w-48 h-64 object-cover rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
                {/* Game Info */}
                <div className="flex-1 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      {gameData?.title}
                    </h1>
                    <p className="text-xl text-gray-300">
                      {formatDate(gameData?.released)}
                    </p>
                  </motion.div>
                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap gap-6 text-gray-300"
                  >
                    <div className="flex items-center gap-2">
                      {renderStars(gameData?.rating, "w-5 h-5")}
                      <span className="font-semibold text-white">
                        {gameData?.rating}
                      </span>
                      <span className="text-sm">
                        ({gameData?.ratings_count?.toLocaleString?.() || 0}{" "}
                        ratings)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold">
                        {gameData?.metacritic}
                      </span>
                      <span className="text-sm">Metacritic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span>{gameData?.playTime} hours</span>
                    </div>
                  </motion.div>
                  {/* Platform Badges */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap gap-2"
                  >
                    {gameData?.platforms?.map((platform, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 text-gray-300 rounded-full text-sm border border-slate-600/50"
                      >
                        {getPlatformIcon(platform)}
                        {platform}
                      </span>
                    ))}
                  </motion.div>
                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleWishlist}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isWishlisted
                          ? "bg-gradient-to-r from-pink-600 to-red-600 text-white"
                          : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-slate-600/50"
                      }`}
                    >
                      {isWishlisted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                      {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isPlayed
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                          : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-slate-600/50"
                      }`}
                    >
                      <Monitor className="w-5 h-5" />
                      {isPlayed ? "Played" : "Not Played"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/reviews/${id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-200"
                    >
                      <Edit3 className="w-5 h-5" />
                      Write a Review
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>

          <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
            {/* Compact Rating Distribution */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-xl"
            >
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
              >
                Rating Distribution
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Compact Bar Chart */}
                <div className="space-y-3">
                  {ratingDistribution.map((item, index) => (
                    <motion.div
                      key={item.rating}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <motion.span
                            className="text-white font-medium text-sm"
                            whileHover={{ scale: 1.1 }}
                          >
                            {item.rating}
                          </motion.span>
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        </div>
                        <div className="flex-1 relative">
                          <div className="bg-slate-700/50 rounded-full h-2 overflow-hidden border border-slate-600/30 group-hover:border-purple-500/50 transition-all duration-300">
                            <motion.div
                              initial={{ width: 0, opacity: 0.7 }}
                              whileInView={{
                                width: `${item.percentage}%`,
                                opacity: 1,
                              }}
                              transition={{
                                duration: 1.2,
                                delay: 0.3 + index * 0.1,
                                ease: "easeOut",
                              }}
                              className={`h-full rounded-full relative overflow-hidden ${
                                item.rating === 5
                                  ? "bg-gradient-to-r from-green-500 to-green-400"
                                  : item.rating === 4
                                  ? "bg-gradient-to-r from-blue-500 to-blue-400"
                                  : item.rating === 3
                                  ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                  : item.rating === 2
                                  ? "bg-gradient-to-r from-orange-500 to-orange-400"
                                  : "bg-gradient-to-r from-red-600 to-red-500"
                              }`}
                            >
                              {/* Animated shine effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                  duration: 2,
                                  delay: 1 + index * 0.2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatDelay: 3,
                                }}
                              />
                            </motion.div>
                          </div>
                        </div>
                        <motion.div
                          className="text-right min-w-[60px]"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.5 + index * 0.1,
                          }}
                        >
                          <div className="text-white font-medium text-sm">
                            {item.count.toLocaleString()}
                          </div>
                          <div className="text-purple-300 text-xs">
                            {item.percentage}%
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Total Reviews",
                      value: game?.ratings_count?.toLocaleString?.() || "0",
                      icon: "📊",
                    },
                    {
                      label: "Average Rating",
                      value: game?.rating || "N/A",
                      icon: "⭐",
                    },
                    {
                      label: "Positive Reviews",
                      value: `${Math.round(
                        ((ratingDistribution[0]?.count +
                          ratingDistribution[1]?.count) /
                          (game?.ratings_count || 1)) *
                          100
                      )}%`,
                      icon: "👍",
                    },
                    {
                      label: "Metacritic Score",
                      value: game?.metacritic || "N/A",
                      icon: "🏆",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(168, 85, 247, 0.2)",
                      }}
                      className="bg-slate-700/60 rounded-lg p-3 text-center border border-slate-600/50 hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div className="text-lg mb-1">{stat.icon}</div>
                      <div className="text-white font-bold text-sm">
                        {stat.value}
                      </div>
                      <div className="text-gray-300 text-xs">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                About This Game
              </h2>
              <div className="text-gray-300 leading-relaxed">
                <div
                  className={`${!showFullDescription ? "line-clamp-3" : ""}`}
                  dangerouslySetInnerHTML={{
                    __html:
                      gameData?.description || "No description available.",
                  }}
                />
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="flex items-center gap-1 mt-3 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showFullDescription ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.section>

            {/* Platforms & Pricing */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Platforms & Pricing
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {gameData?.platforms?.map((platform, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-700/60 rounded-lg p-3 border border-slate-600/50 hover:border-purple-500/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {getPlatformIcon(platform)}
                      <span className="font-medium text-white">{platform}</span>
                    </div>
                    {platformPrices[platform] ? (
                      <div className="text-sm text-gray-300">
                        <div className="text-purple-400 font-semibold">
                          {platformPrices[platform].price}
                        </div>
                        <div>{platformPrices[platform].platform}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">
                        <div>Price not available</div>
                        <div>Check store</div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Genres */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Genres
              </h2>
              <div className="flex flex-wrap gap-3">
                {gameData?.genre?.map((genre, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-200 rounded-full font-medium cursor-pointer hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-200"
                  >
                    {genre}
                  </motion.span>
                ))}
              </div>
            </motion.section>

            {/* Reviews Section with New Review Cards */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Reviews ({reviews.length})
              </h2>

              <div className="space-y-6">
                {!reviewsLoaded ? (
                  // Show skeleton while loading
                  [...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/60 rounded-lg p-4 border border-slate-600/50 animate-pulse"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-600 rounded-full"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-slate-600 rounded w-1/4"></div>
                          <div className="h-3 bg-slate-600 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <AnimatePresence>
                      {reviews.slice(0, visibleReviews).map((review, index) => (
                        <ReviewComponent
                          key={review._id || `review-${index}`}
                          review={review}
                          index={index}
                          onUserClick={handleUserClick}
                          onGameClick={handleGameClick}
                        />
                      ))}
                    </AnimatePresence>

                    {visibleReviews < reviews.length && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setVisibleReviews((prev) => prev + 3)}
                        className="w-full py-3 bg-gradient-to-r from-slate-700/50 to-slate-600/50 text-gray-300 rounded-xl border border-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 hover:border-purple-500/50 transition-all duration-200 font-medium"
                      >
                        Load More Reviews ({reviews.length - visibleReviews}{" "}
                        remaining)
                      </motion.button>
                    )}
                  </>
                )}
              </div>
            </motion.section>

            {/* Screenshots & Media */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Screenshots & Media
                </h2>
                {gameData?.screenshots && gameData.screenshots.length > 1 && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        autoScrollInterval ? "bg-green-400" : "bg-gray-500"
                      }`}
                    ></div>
                    <span>{autoScrollInterval ? "Auto-scroll" : "Paused"}</span>
                  </div>
                )}
              </div>
              {/* Main Screenshot Display */}
              <div className="relative mb-4">
                {Array.isArray(gameData?.screenshots) &&
                gameData?.screenshots.length > 0 ? (
                  <motion.div
                    key={currentScreenshot}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative aspect-[16/9] max-h-80 lg:max-h-96 bg-slate-700/50 rounded-lg overflow-hidden mx-auto max-w-3xl lg:max-w-4xl"
                  >
                    <img
                      src={
                        gameData?.screenshots?.[currentScreenshot]?.image ||
                        gameData?.screenshots?.[currentScreenshot]?.url ||
                        "/placeholder.svg"
                      }
                      alt={
                        gameData?.screenshots?.[currentScreenshot]?.caption ||
                        "Game screenshot"
                      }
                      className="w-full h-full object-cover"
                    />

                    {/* Video Play Button */}
                    {gameData?.screenshots?.[currentScreenshot]?.type ===
                      "video" && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                      >
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation Arrows */}
                    <button
                      onClick={() => prevScreenshot(gameData?.screenshots)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => nextScreenshot(gameData?.screenshots)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Caption Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white font-medium">
                        {gameData?.screenshots?.[currentScreenshot]?.caption}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="aspect-[16/9] max-h-80 lg:max-h-96 bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-400 mx-auto max-w-3xl lg:max-w-4xl">
                    No screenshots available.
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {Array.isArray(gameData?.screenshots) &&
                gameData?.screenshots.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
                    {gameData?.screenshots?.map((screenshot, index) => (
                      <motion.div
                        key={screenshot?.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          pauseAutoScroll();
                          setCurrentScreenshot(index);
                          // Resume auto-scroll after 5 seconds of inactivity
                          setTimeout(resumeAutoScroll, 5000);
                        }}
                        className={`relative flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                          index === currentScreenshot
                            ? "border-purple-500"
                            : "border-slate-600/50 hover:border-purple-400"
                        }`}
                      >
                        <img
                          src={
                            screenshot?.image ||
                            screenshot?.url ||
                            "/placeholder.svg"
                          }
                          alt={screenshot?.caption}
                          className="w-full h-full object-cover"
                        />
                        {screenshot?.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
            </motion.section>

            {/* Similar Games */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Similar Games
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {gameData?.similarGames?.map((game, index) => (
                  <motion.div
                    key={game?.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex-shrink-0 w-36 bg-slate-700/60 rounded-lg overflow-hidden border border-slate-600/50 hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
                  >
                    <img
                      src={game?.coverImage || "/placeholder.svg"}
                      alt={game?.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">
                        {game?.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(game?.rating)}
                        <span className="text-sm text-gray-400">
                          {game?.rating}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {game?.genre?.slice(0, 2).map((genre, genreIndex) => (
                          <span
                            key={genreIndex}
                            className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* External Links */}
            {gameData?.website && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  External Links
                </h2>
                <motion.a
                  href={gameData?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-200"
                >
                  <ExternalLink className="w-5 h-5" />
                  Official Website
                </motion.a>
              </motion.section>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
