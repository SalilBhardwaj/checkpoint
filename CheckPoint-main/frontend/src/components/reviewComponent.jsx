"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Heart, Calendar } from "lucide-react";

// Utility function to format time ago
const timeAgoFromDate = (date) => {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffInSeconds = Math.floor((now - reviewDate) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

// Mock function to fetch user data (replace with actual API call)
const fetchUserData = async (userId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock user data - replace with actual API call
  const mockUsers = {
    "6866d051769f950e3c0bc0b3": {
      _id: "6866d051769f950e3c0bc0b3",
      userName: "akashca7aaf",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    user2: {
      _id: "user2",
      userName: "gamer_pro_2024",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    user3: {
      _id: "user3",
      userName: "stealth_ninja",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  };

  return (
    mockUsers[userId] || {
      _id: userId,
      userName: "Unknown User",
      avatar: "/placeholder.svg?height=40&width=40",
    }
  );
};

const ReviewCard = ({ review, index = 0, onUserClick, onGameClick }) => {
  // Use the populated user data directly from the API
  const user = review.createdBy || {
    _id: "unknown",
    userName: "Unknown User",
    name: "Unknown User",
    profileImage: "/placeholder.svg?height=40&width=40",
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.5 + i * 0.1,
              type: "spring",
              stiffness: 200,
            }}
          >
            <Star
              className={`w-4 h-4 ${
                i < fullStars
                  ? "fill-yellow-400 text-yellow-400"
                  : i === fullStars && hasHalfStar
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "text-slate-600"
              }`}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      }}
      className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onUserClick?.(user._id)}
          className="relative cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-600/50 group-hover:ring-purple-500/50 transition-all duration-300">
            <img
              src={user?.profileImage || "/placeholder.svg?height=40&width=40"}
              alt={user?.userName || "User"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=40&width=40";
              }}
            />
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800" />
        </motion.div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.h4
                whileHover={{ color: "#a855f7" }}
                onClick={() => onUserClick?.(user._id)}
                className="font-semibold text-white cursor-pointer transition-colors duration-200"
              >
                {user?.userName || "Unknown User"}
              </motion.h4>

              {/* Rating Stars */}
              <div className="flex items-center gap-2">
                {renderStars(review.rating)}
                <span className="text-sm font-medium text-yellow-400">
                  {review.rating}/5
                </span>
              </div>
            </div>

            {/* Liked Status */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1"
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200 ${
                  review.liked
                    ? "fill-red-500 text-red-500"
                    : "text-slate-500 hover:text-red-400"
                }`}
              />
              {review.liked && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-red-400 font-medium"
                >
                  Liked
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Time Ago */}
          <div className="flex items-center gap-2 mb-3 text-sm text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{timeAgoFromDate(review.createdAt)}</span>
          </div>

          {/* Review Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="text-slate-300 leading-relaxed mb-4 group-hover:text-slate-200 transition-colors duration-300"
          >
            {review.reviewText}
          </motion.p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {review.tags.map((tag, tagIndex) => (
              <motion.span
                key={tagIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.6 + tagIndex * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)",
                }}
                className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-purple-200 rounded-full text-sm font-medium cursor-pointer hover:from-purple-600/30 hover:to-indigo-600/30 transition-all duration-200 flex-shrink-0"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default ReviewCard;
