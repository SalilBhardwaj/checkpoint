import React from "react";
import { Filter, Calendar, Star, Clock, TrendingUp } from "lucide-react";

/**
 * SortDialogBox component
 * @param {Object} props
 * @param {string} sortBy - Current sort field
 * @param {string} sortOrder - Current sort order (asc/desc)
 * @param {(field: string, order: string) => void} handleSort - Callback for sort change
 * @param {function} onClose - Callback to close the dialog
 */
export default function SortDialogBox({
  sortBy,
  sortOrder,
  handleSort,
  onClose,
}) {
  const [localSortBy, setLocalSortBy] = React.useState(() => {
    const saved = window.sessionStorage.getItem("sortBy");
    return saved || sortBy;
  });
  const [localSortOrder, setLocalSortOrder] = React.useState(() => {
    const saved = window.sessionStorage.getItem("sortOrder");
    return saved || sortOrder;
  });

  const handleLocalSort = (field, order) => {
    setLocalSortBy(field);
    setLocalSortOrder(order);
    window.sessionStorage.setItem("sortBy", field);
    window.sessionStorage.setItem("sortOrder", order);
    handleSort(field, order);
  };

  return (
    <div className="bg-[#18181b] rounded-lg shadow-lg p-6 w-[350px] max-w-full border border-[#252525]">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <div className="flex items-center mb-6">
        <Filter className="w-6 h-6 mr-2 text-purple-400" />
        <h2 className="text-2xl font-bold">Sort Games</h2>
      </div>
      <div className="space-y-6">
        {/* Released */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="font-medium">Released</span>
          </div>
          <div className="ml-6 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                id="released-desc"
                name="released"
                onChange={() => handleLocalSort("released", "desc")}
                checked={localSortBy === "released" && localSortOrder === "desc"}
                className="accent-purple-500"
              />
              <span>Newest to Oldest</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                id="released-asc"
                name="released"
                onChange={() => handleLocalSort("released", "asc")}
                checked={localSortBy === "released" && localSortOrder === "asc"}
                className="accent-purple-500"
              />
              <span>Oldest to Newest</span>
            </label>
          </div>
        </div>
        {/* Rating */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="font-medium">Rating</span>
          </div>
          <div className="ml-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                id="rating"
                name="sort"
                onChange={() => handleLocalSort("rating", "desc")}
                checked={localSortBy === "rating"}
                className="accent-yellow-400"
              />
              <span>Highest to Lowest</span>
            </label>
          </div>
        </div>
        {/* Added At */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="font-medium">Added At</span>
          </div>
          <div className="ml-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                id="addedAt"
                name="sort"
                onChange={() => handleLocalSort("addedAt", "desc")}
                checked={localSortBy === "addedAt"}
                className="accent-blue-400"
              />
              <span>Latest Activity</span>
            </label>
          </div>
        </div>
        {/* Popularity */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="font-medium">Popularity</span>
          </div>
          <div className="ml-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                id="popularity"
                name="sort"
                onChange={() => handleLocalSort("popularity", "desc")}
                checked={localSortBy === "popularity"}
                className="accent-green-400"
              />
              <span>RAWG Score</span>
            </label>
          </div>
        </div>
        {/* Name */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-4 h-4 text-center text-sm font-bold text-gray-400">
              🔤
            </span>
            <span className="font-medium">Name</span>
          </div>
          <div className="ml-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                id="name"
                name="sort"
                onChange={() => handleLocalSort("name", "asc")}
                checked={localSortBy === "name"}
                className="accent-gray-400"
              />
              <span>Alphabetical</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
