"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Share2,
  Heart,
  Eye,
  Users,
  Lock,
  Calendar,
  User,
  Hash,
  X,
  Search,
  Trash,
} from "lucide-react";
import { MainNav } from "../components/MainNav";
import { GameCard } from "../components/GameCard";

export default function ListDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // State management
  const [list, setList] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddGamesModal, setShowAddGamesModal] = useState(false);
  const [availableGames, setAvailableGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGames, setSelectedGames] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [searchedGames, setSearchedGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    tags: "",
    whoCanView: "public",
    coverImage: null,
  });

  const updateList = async () => {
    const response = await fetch(`${baseUrl}/list/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listDetails: editForm }),
    });
    const data = await response.json();
    console.log(data);
  };

  const handleDeleteList = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this list? This action cannot be undone."
    );
    if (!confirmed) return;
    const response = await fetch(`${baseUrl}/list/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    navigate("/lists");
  };

  // Fetch list details
  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/list/${id}`, {
          credentials: "include",
        });
        if (response.status === 401) {
          window.location.href = "/sign-in";
          return;
        }
        const data = await response.json();

        if (response.ok) {
          setList(data.list);
          setListItems(data.list.listItems || []);
          setEditForm({
            title: data.list.title,
            description: data.list.description,
            tags: Array.isArray(data.list.tags)
              ? data.list.tags.join(", ")
              : data.list.tags || "",
            whoCanView: data.list.whoCanView || "public",
            coverImage: null,
          });
        }
      } catch (error) {
        console.error("Error fetching list:", error);
      } finally {
        setLoading(false);
      }
    };

    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    console.log(user);
    if (user && token) {
      setCurrentUser(JSON.parse(user));
    }

    fetchListDetails();
  }, [id, baseUrl]);

  // Check if current user is the owner
  useEffect(() => {
    if (currentUser && list) {
      setIsOwner(String(currentUser._id) === String(list.createdBy._id));
    }
    console.log(String(currentUser?._id) + " " + String(list?.createdBy._id));
  }, [currentUser, list]);

  // Fetch available games for adding
  const fetchAvailableGames = async () => {
    try {
      const response = await fetch(`${baseUrl}/games/popular?limit=50`);
      const data = await response.json();
      setAvailableGames(data.games || []);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "private":
        return <Lock className="w-4 h-4" />;
      case "friends":
        return <Users className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editForm.title.trim() || !editForm.description.trim()) {
      alert("Title and description are required!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("tags", editForm.tags);
      formData.append("whoCanView", editForm.whoCanView);

      if (editForm.coverImage) {
        formData.append("coverImage", editForm.coverImage);
      }

      const response = await fetch(`${baseUrl}/list/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const updatedList = await response.json();
        setList(updatedList.list);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  const handleAddGames = async () => {
    if (selectedGames.length === 0) {
      alert("Please select at least one game!");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/list/${id}/add`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameIds: selectedGames,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setListItems(data.list.listItems);
        setSelectedGames([]);
        setShowAddGamesModal(false);
      }
    } catch (error) {
      console.error("Error adding games:", error);
    }
  };

  const handleRemoveGame = async (gameId) => {
    try {
      const response = await fetch(`${baseUrl}/list/${id}/remove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game: gameId }),
        credentials: "include",
      });

      if (response.ok) {
        setListItems(listItems.filter((item) => item._id !== gameId));
      }
    } catch (error) {
      console.error("Error removing game:", error);
    }
  };

  const handleGameSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchedGames([]);
      return;
    }
    try {
      const response = await fetch(
        `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchedGames(data.games || []);
    } catch (error) {
      console.error("Error searching games:", error);
      setSearchedGames([]);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setFilteredGames(
        searchedGames.length > 0
          ? searchedGames
          : availableGames.filter((game) =>
              game.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
      );
    } else {
      setFilteredGames(availableGames);
    }
  }, [availableGames, searchedGames, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <MainNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading list details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-black text-white">
        <MainNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">List not found</h2>
            <p className="text-gray-400 mb-4">
              The list you're looking for doesn't exist.
            </p>
            <Link to="/lists" className="btn btn-neon">
              Back to Lists
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-6">
      <MainNav />

      {/* Hero Section */}
      <div className="relative">
        {list.coverImage && (
          <div className="absolute inset-0 h-96">
            <img
              src={list.coverImage || "/placeholder.svg"}
              alt={list.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          </div>
        )}

        <div className="relative container py-8">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>

          {/* List Header */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cover Image */}
            {list.coverImage && (
              <div className="w-full lg:w-80 aspect-video bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={list.coverImage || "/placeholder.svg"}
                  alt={list.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* List Info */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="badge">LIST</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    {getVisibilityIcon(list.whoCanView)}
                    <span className="text-sm capitalize">
                      {list.whoCanView}
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">
                  {list.title}
                </h1>

                <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>
                      Created by{" "}
                      <span className="text-white font-medium">
                        {list.createdBy?.userName || list.createdBy}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(list.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span>{listItems.length} games</span>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {list.description}
                </p>

                {/* Tags */}
                {list.tags && list.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(Array.isArray(list.tags)
                      ? list.tags
                      : list.tags.split(",")
                    ).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-purple-600/20 text-purple-300 text-sm px-3 py-1 rounded-full border border-purple-600/30"
                      >
                        <Hash className="w-3 h-3" />
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {isOwner && (
                    <>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="btn btn-outline flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit List
                      </button>
                      <button
                        onClick={handleDeleteList}
                        className="btn btn-outline flex items-center gap-2"
                      >
                        <Trash className="w-4 h-4" />
                        Delete List
                      </button>
                      <button
                        onClick={() => {
                          setShowAddGamesModal(true);
                          fetchAvailableGames();
                        }}
                        className="btn btn-neon flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Games
                      </button>
                    </>
                  )}
                  <button className="btn btn-outline flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    className={`btn btn-outline flex items-center gap-2 ${
                      isLiked ? "text-red-500 border-red-500" : ""
                    }`}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                    />
                    {isLiked ? "Liked" : "Like"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Games in this list</h2>
          <span className="text-gray-400">{listItems?.length} games</span>
        </div>

        {listItems && listItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-900 rounded-xl p-8 max-w-md mx-auto border border-gray-800">
              <Hash className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No games yet
              </h3>
              <p className="text-gray-500 mb-4">
                This list is empty.{" "}
                {isOwner
                  ? "Add some games to get started!"
                  : "Check back later for updates."}
              </p>
              {isOwner && (
                <button
                  onClick={() => {
                    setShowAddGamesModal(true);
                    fetchAvailableGames();
                  }}
                  className="btn btn-neon"
                >
                  Add Games
                </button>
              )}
            </div>
          </div>
        ) : (
          // <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          //     {listItems.map((game) => (
          //         <div key={game._id} className="relative group">
          //             <GameCard game={game} />
          //             {isOwner && (
          //                 <button
          //                     onClick={() => handleRemoveGame(game._id)}
          //                     className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          //                 >
          //                     <X className="w-4 h-4" />
          //                 </button>
          //             )}
          //         </div>
          //     ))}
          // </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {listItems.map((item) => (
              <div key={item._id} className="relative group">
                <GameCard game={item.game} />
                {isOwner && (
                  <button
                    onClick={() => handleRemoveGame(item._id)}
                    className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit List Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Edit List</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="input w-full resize-none"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Tags
                </label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tags: e.target.value })
                  }
                  className="input w-full"
                  placeholder="action, adventure, rpg"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Visibility
                </label>
                <select
                  value={editForm.whoCanView}
                  onChange={(e) =>
                    setEditForm({ ...editForm, whoCanView: e.target.value })
                  }
                  className="input w-full"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditForm({ ...editForm, coverImage: e.target.files[0] })
                  }
                  className="input w-full"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  onClick={updateList}
                  className="btn btn-neon flex-1"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Games Modal */}
      {showAddGamesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Add Games to List</h3>
              <button
                onClick={() => setShowAddGamesModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input w-full pr-10" // <-- pr-10 for right padding
                />
                <button
                  type="button"
                  onClick={handleGameSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  tabIndex={-1}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6 max-h-96 overflow-y-auto">
              {filteredGames?.map((game) => (
                <div
                  key={game._id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedGames.includes(game._id)
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  onClick={() => {
                    if (selectedGames.includes(game._id)) {
                      setSelectedGames(
                        selectedGames.filter((id) => id !== game._id)
                      );
                    } else {
                      setSelectedGames([...selectedGames, game._id]);
                    }
                  }}
                >
                  <img
                    src={game.coverImage || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {game.title}
                    </h4>
                  </div>
                  {selectedGames.includes(game._id) && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                {selectedGames.length} game
                {selectedGames.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleAddGames}
                  disabled={selectedGames.length === 0}
                  className="btn btn-neon disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Selected Games
                </button>
                <button
                  onClick={() => setShowAddGamesModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
