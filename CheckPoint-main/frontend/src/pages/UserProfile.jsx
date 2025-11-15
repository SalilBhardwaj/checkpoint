"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainNav } from "../components/MainNav";
import dayjs from "dayjs";
import { GameCard } from "../components/GameCard";
import { ThemeContext } from "../ThemeContext";
import ListCard from "../components/ListCard";
import ReviewCard from "../components/reviewCard";
import FavoritesSection from "../components/FavouritesSection";
import {
  User,
  Settings,
  Camera,
  Edit3,
  Calendar,
  Heart,
  Star,
  List,
  GamepadIcon,
  X,
  Save,
  Upload,
  MapPin,
  UserPlus,
  UserMinus,
  BookHeart,
  Search,
  MoreHorizontal,
  Globe,
} from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [activeTab, setActiveTab] = useState("overview");
  const [games, setGames] = useState([]);
  const [lists, setLists] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favouritesGames, setFavouritesGames] = useState(null);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [editError, setEditError] = useState("");
  const [editFormData, setEditFormData] = useState({
    name: user?.name || "",
    userName: user?.userName || "",
    description: profile?.description || "",
    email: user?.email || "",
    profileImage: user?.profileImage || null, // <-- add this
  });

  useEffect(() => {
    setLoading(true);
    const fetchUserId = async () => {
      const response = await fetch(`${baseUrl}/profile/user/${id}/`, {
        method: 'GET',
      })
      if (!response.ok) {
        navigate("/");
      }
      const data = await response.json();
      setUserId(data.userId);
    }
    if (id)
      fetchUserId();
    // setLoading(false);
  }, [id]);

  const currentUser = JSON.parse(localStorage.getItem("user"))?._id;
  useEffect(() => {
    if (currentUser == userId)
      navigate("/profile");
    return;
  }, [currentUser, userId]);

  const [favouriteGenre, setFavouriteGenre] = useState([]);

  useEffect(() => {
    const fetchFavGenre = async () => {
      const response = await fetch(`${baseUrl}/favGenres/${userId}`, {
        credentials: "include",
      });
      console.log(response.status);

      if (response.status == 200) {
        const data = await response.json();
        console.log(data);
        setFavouriteGenre(data.favGenres);
      } else {
        setFavouriteGenre([]);
      }
    };
    if (userId != null || userId != undefined) fetchFavGenre();
  }, [userId, baseUrl]);

  useEffect(() => {
    if (user && profile) {
      setEditFormData({
        name: user.name || "",
        userName: user.userName || "",
        description: profile.description || "",
        email: user.email || "",
        profileImage: user.profileImage || null,
      });
    }
  }, [user, profile]);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (reviews) {
      const newGames = reviews.map((review) => review.review.game);
      setGames([...newGames]);
    }
  }, [reviews]);


  useEffect(() => {
    if (!userId)
      return;
    // setLoading(true);
    async function fetchData() {
      const response = await fetch(`${baseUrl}/profile/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      const data = await response.json();
      console.log(data);
      return data;
    }
    fetchData().then((result) => {
      setProfile(result.profile);
      setUser(result.profile.user);
      setWishlist(result.profile.wishlist);
      setReviews(result.profile.reviews);
      setFavouritesGames(result.profile.favourites);
      setLists(result.profile.lists);
    });
    setLoading(false);
  }, [baseUrl, userId]);


  const stats = {
    gamesPlayed: games.length || 0,
    reviews: reviews?.length || 0,
    lists: profile?.lists?.length || 8,
    followers: profile?.followers?.length || 0,
    following: profile?.followings?.length || 0,
    favourites: profile?.favourites?.length || 4,
    wishlist: wishlist?.length || 0,
  };


  //   if (!profile) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-lg shadow">
  //       <User className="w-12 h-12 text-gray-400 mb-4" />
  //       <span className="text-gray-600 text-lg font-semibold">Profile not found</span>
  //       <span className="text-gray-400 text-sm mt-2">
  //         The user profile you are looking for does not exist or could not be loaded.
  //       </span>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500 text-lg">Loading profile...</span>
      </div>
    );
  }



  if (profile) {
    return (
      <div
        className={`min-h-screen ${theme === "dark" ? "bg-black text-white" : "bg-gray-50 text-black"
          }`}
      >
        <MainNav />

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Profile Header */}
          <div
            className={`rounded-2xl p-8 mb-8 ${theme === "dark"
              ? "bg-gray-900/50 border border-gray-800"
              : "bg-white border border-gray-200"
              } backdrop-blur-sm`}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image & Basic Info */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-purple-500/20 shadow-xl">
                    <img
                      src={
                        editFormData.profileImage ||
                        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold mb-2">
                    {user?.name || "User Name"}
                  </h1>
                  <p
                    className={`text-lg mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    @{user?.userName || "username"}
                  </p>

                  {/* Description */}
                  <p
                    className={`text-sm mb-4 max-w-md ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    {profile?.description ||
                      "Gaming enthusiast and reviewer. Love exploring new worlds and sharing experiences with fellow gamers. Always up for a good co-op session!"}
                  </p>

                  {/* User Details */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500">
                        Joined {user && dayjs(user.createdAt).format("MMM YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex-1 lg:ml-auto">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {stats.gamesPlayed}
                    </div>
                    <div className="text-sm text-gray-500">Games</div>
                  </div>
                  <div
                    className="text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
                    onClick={() => setFollowersModalOpen(true)}
                  >
                    <div className="text-2xl font-bold text-blue-500">
                      {stats.followers}
                    </div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div
                    className="text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
                    onClick={() => setFollowingModalOpen(true)}
                  >
                    <div className="text-2xl font-bold text-green-500">
                      {stats.following}
                    </div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full xl:w-80 space-y-6">
              {/* Quick Stats */}
              <div
                className={`rounded-2xl p-6 ${theme === "dark"
                  ? "bg-gray-900/50 border border-gray-800"
                  : "bg-white border border-gray-200"
                  }`}
              >
                <h3 className="font-bold mb-4 text-lg">Gaming Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Star className="w-4 h-4 text-purple-500" />
                      </div>
                      <span className="text-sm">Reviews</span>
                    </div>
                    <span className="font-semibold">{stats.reviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <List className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm">Lists</span>
                    </div>
                    <span className="font-semibold">{stats.lists}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <Heart className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="text-sm">Wishlist</span>
                    </div>
                    <span className="font-semibold">{stats.wishlist}</span>
                  </div>
                </div>
              </div>

              {/* Favorite Genres */}
              <div
                className={`rounded-2xl p-6 ${theme === "dark"
                  ? "bg-gray-900/50 border border-gray-800"
                  : "bg-white border border-gray-200"
                  }`}
              >
                <h3 className="font-bold mb-4 text-lg">Favorite Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {favouriteGenre.length > 0 &&
                    favouriteGenre?.map((genre) => (
                      <span
                        key={genre}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${theme === "dark"
                          ? "bg-gray-800 text-gray-300 border border-gray-700"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                      >
                        {genre}
                      </span>
                    ))}
                  {(favouriteGenre.length == 0 ||
                    favouriteGenre == undefined) && <span>No Games Played.</span>}
                </div>
              </div>

              {/* Recent Activity */}
              <div
                className={`rounded-2xl p-6 ${theme === "dark"
                  ? "bg-gray-900/50 border border-gray-800"
                  : "bg-white border border-gray-200"
                  }`}
              >
                <h3 className="font-bold mb-4 text-lg">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm">
                      <p className="font-medium">Added to favorites</p>
                      <p className="text-gray-500 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm">
                      <p className="font-medium">Wrote a review</p>
                      <p className="text-gray-500 text-xs">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm">
                      <p className="font-medium">Created a new list</p>
                      <p className="text-gray-500 text-xs">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Navigation Tabs */}
              <div className="mb-8">
                <div
                  className={`p-1.5 rounded-2xl flex flex-wrap gap-1 ${theme === "dark"
                    ? "bg-gray-900/50 border border-gray-800"
                    : "bg-white border border-gray-200"
                    }`}
                >
                  {[
                    { id: "overview", label: "Overview", icon: User },
                    { id: "games", label: "Games", icon: GamepadIcon },
                    { id: "reviews", label: "Reviews", icon: Star },
                    { id: "lists", label: "Lists", icon: List },
                    { id: "wishlist", label: "Wishlist", icon: BookHeart },
                    { id: "favourite", label: "Favourites", icon: Heart },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === id
                        ? "bg-purple-500 text-white shadow-lg"
                        : theme === "dark"
                          ? "text-gray-400 hover:text-white hover:bg-gray-800"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div
                className={`rounded-2xl p-6 ${theme === "dark"
                  ? "bg-gray-900/50 border border-gray-800"
                  : "bg-white border border-gray-200"
                  }`}
              >
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Overview</h2>

                      {/* Recent Games */}
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">
                          Recently Played
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {games?.slice(0, 6).map((game) => (
                            <GameCard key={game?.id} game={game} />
                          ))}
                        </div>
                      </div>

                      {/* Recent Reviews */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Latest Reviews
                        </h3>
                        <div className="space-y-4">
                          {reviews.slice(0, 5).map((review, i) => (
                            <div
                              key={i}
                              className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                                }`}
                            >
                              <ReviewCard review={review.review} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "games" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Games Collection</h2>
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                        <GamepadIcon className="w-4 h-4" />
                        Add Game
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {games.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-12">
                          No games found.
                        </div>
                      )}
                      {games.map((game) => (
                        <GameCard key={game.id} game={game} />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "lists" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">My Lists</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {lists?.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-12">
                          No lists found.
                        </div>
                      )}
                      {lists?.map((items) => (
                        <ListCard key={items.list._id} {...items.list} />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "favourite" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Favourite Games</h2>
                    {Array.isArray(favouritesGames) ? (
                      <FavoritesSection
                        initialFavorites={favouritesGames}
                      // onUpdateFavorites={setFavouritesGames}
                      // availableGames={games}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="text-gray-500 mt-4">
                          Loading favourites...
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">My Reviews</h2>

                    </div>

                    <div className="space-y-6">
                      {reviews.map((review, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                            }`}
                        >
                          <ReviewCard review={review.review} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "wishlist" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Gaming Wishlist</h2>

                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {wishlist.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-12">
                          No games found.
                        </div>
                      )}
                      {wishlist.map((wish) => (
                        <GameCard key={wish.game.id} game={wish.game} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Followers Modal */}
        {followersModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className={`w-full max-w-md rounded-2xl p-6 ${theme === "dark"
                ? "bg-gray-900 border border-gray-800"
                : "bg-white border border-gray-200"
                }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Followers</h2>
                <button
                  onClick={() => setFollowersModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search followers..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300"
                      }`}
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {followers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">@{user.userName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleFollowToggle(user.id, user.isFollowing)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${user.isFollowing
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/20"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                        }`}
                    >
                      {user.isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4 inline mr-1" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 inline mr-1" />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Following Modal */}
        {followingModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className={`w-full max-w-md rounded-2xl p-6 ${theme === "dark"
                ? "bg-gray-900 border border-gray-800"
                : "bg-white border border-gray-200"
                }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Following</h2>
                <button
                  onClick={() => setFollowingModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search following..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300"
                      }`}
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {following.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">@{user.userName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollowToggle(user.id, true)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <UserMinus className="w-4 h-4 inline mr-1" />
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
