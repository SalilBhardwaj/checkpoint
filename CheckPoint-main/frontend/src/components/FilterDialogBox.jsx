import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const genres = [
  "Action",
  "Adventure",
  "RPG",
  "Shooter",
  "Puzzle",
  "Strategy",
  "Sports",
  "Racing",
  "Simulation",
  "Horror",
];
const platforms = ["PC", "PS5", "Xbox", "Switch", "Mobile"];
const developers = [
  "Valve",
  "Rockstar North",
  "CD Projekt RED",
  "Crystal Dynamics",
  "Ubisoft",
  "EA DICE",
  "Activision",
];
const publishers = [
  "Valve",
  "Rockstar Games",
  "CD Projekt",
  "Square Enix",
  "Ubisoft",
  "Electronic Arts",
  "Activision",
];

const defaultFilters = {
  genres: [],
  platforms: [],
  yearRange: [2000, 2024],
  ratingRange: [0, 5],
  developers: [],
  publishers: [],
  userStatus: {
    played: false,
    toPlay: false,
    reviewed: false,
    favorited: false,
  },
};

export default function FilterDialogBox({ onClose, triggerUpdate }) {
  const [filters, setFilters] = useState(() => {
    const saved = window.sessionStorage.getItem("filters");
    return saved ? JSON.parse(saved) : defaultFilters;
  });

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters };
    if (["genres", "platforms", "developers", "publishers"].includes(type)) {
      const arr = newFilters[type];
      if (arr.includes(value)) {
        newFilters[type] = arr.filter((item) => item !== value);
      } else {
        newFilters[type] = [...arr, value];
      }
    } else if (type === "yearRange" || type === "ratingRange") {
      newFilters[type] = value;
    } else if (type.startsWith("userStatus.")) {
      const key = type.split(".")[1];
      newFilters.userStatus[key] = value;
    }
    setFilters(newFilters);
    window.sessionStorage.setItem("filters", JSON.stringify(newFilters));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    window.sessionStorage.setItem("filters", JSON.stringify(defaultFilters));
  };

  const handleApply = () => {
    window.sessionStorage.setItem("filters", JSON.stringify(filters));
    onClose(); // Parent will handle triggerUpdate
  };

  return (
    <div className="bg-[#18181b] rounded-lg shadow-lg p-6 w-[750px] max-w-full border border-[#252525] max-h-[70vh] overflow-y-auto">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
        onClick={clearFilters}
        aria-label="Close"
      >
        ×
      </button>
      <div className="flex items-center mb-6">
        <SlidersHorizontal className="w-6 h-6 mr-2 text-purple-400" />
        <h2 className="text-2xl font-bold">Advanced Filters</h2>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Genre Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Genre</h3>
            <div className="grid grid-cols-2 gap-2">
              {genres.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(genre)}
                    onChange={() => handleFilterChange("genres", genre)}
                    className="accent-purple-500"
                  />
                  <span className="text-sm">{genre}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Platform Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Platform</h3>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <label
                  key={platform}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.platforms.includes(platform)}
                    onChange={() => handleFilterChange("platforms", platform)}
                    className="accent-blue-400"
                  />
                  <span className="text-sm">{platform}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Release Year Range */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Release Year</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-400">
                <span>{filters.yearRange[0]}</span>
                <span>{filters.yearRange[1]}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={2024}
                step={1}
                value={filters.yearRange[0]}
                onChange={(e) =>
                  handleFilterChange("yearRange", [
                    Number(e.target.value),
                    filters.yearRange[1],
                  ])
                }
                className="w-full accent-purple-500"
              />
              <input
                type="range"
                min={2000}
                max={2024}
                step={1}
                value={filters.yearRange[1]}
                onChange={(e) =>
                  handleFilterChange("yearRange", [
                    filters.yearRange[0],
                    Number(e.target.value),
                  ])
                }
                className="w-full accent-purple-500"
              />
            </div>
          </div>
          {/* Rating Range */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Rating Range</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-400">
                <span>{filters.ratingRange[0].toFixed(1)}</span>
                <span>{filters.ratingRange[1].toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={filters.ratingRange[0]}
                onChange={(e) =>
                  handleFilterChange("ratingRange", [
                    Number(e.target.value),
                    filters.ratingRange[1],
                  ])
                }
                className="w-full accent-yellow-400"
              />
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={filters.ratingRange[1]}
                onChange={(e) =>
                  handleFilterChange("ratingRange", [
                    filters.ratingRange[0],
                    Number(e.target.value),
                  ])
                }
                className="w-full accent-yellow-400"
              />
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-6">
          {/* Developer Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Developer</h3>
            <div className="space-y-2">
              {developers.map((developer) => (
                <label
                  key={developer}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.developers.includes(developer)}
                    onChange={() => handleFilterChange("developers", developer)}
                    className="accent-green-400"
                  />
                  <span className="text-sm">{developer}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Publisher Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Publisher</h3>
            <div className="space-y-2">
              {publishers.map((publisher) => (
                <label
                  key={publisher}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.publishers.includes(publisher)}
                    onChange={() => handleFilterChange("publishers", publisher)}
                    className="accent-pink-400"
                  />
                  <span className="text-sm">{publisher}</span>
                </label>
              ))}
            </div>
          </div>
          {/* User Status Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">User Status</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.userStatus.played}
                  onChange={(e) =>
                    handleFilterChange("userStatus.played", e.target.checked)
                  }
                  className="accent-green-500"
                />
                <span className="text-sm">Played</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.userStatus.toPlay}
                  onChange={(e) =>
                    handleFilterChange("userStatus.toPlay", e.target.checked)
                  }
                  className="accent-blue-500"
                />
                <span className="text-sm">To-Play</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.userStatus.reviewed}
                  onChange={(e) =>
                    handleFilterChange("userStatus.reviewed", e.target.checked)
                  }
                  className="accent-yellow-500"
                />
                <span className="text-sm">Reviewed</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.userStatus.favorited}
                  onChange={(e) =>
                    handleFilterChange("userStatus.favorited", e.target.checked)
                  }
                  className="accent-pink-500"
                />
                <span className="text-sm">Favorited</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-6 border-t border-gray-700 mt-6">
        <button
          className="px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800"
          onClick={clearFilters}
        >
          Clear All
        </button>
        <button
          className="px-4 py-2 rounded border border-purple-600 text-purple-300 hover:bg-purple-800"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
