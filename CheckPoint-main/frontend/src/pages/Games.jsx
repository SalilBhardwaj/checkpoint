import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MainNav } from "../components/MainNav";
import { GameCard } from "../components/GameCard";
import SortDialogBox from "../components/SortDialogBox";
import FilterDialogBox from "../components/FilterDialogBox";

export default function Games() {
  const location = useLocation();
  const tab = location.state?.activeTab || "popular";
  const [activeTab, setActiveTab] = useState(tab);
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(18);
  const [totalPages, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Sort dialog state
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState("released");
  const [sortOrder, setSortOrder] = useState("desc");
  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setShowSort(false);
    // Optionally refetch or sort games here
  };

  // Filter dialog state
  const [showFilter, setShowFilter] = useState(false);

  const handleIncrement = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  const handleDecrement = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Get filter and sort values from sessionStorage
  const getFilterAndSortParams = () => {
    let params = {};
    // Sort
    const sortBySession = window.sessionStorage.getItem("sortBy");
    const sortOrderSession = window.sessionStorage.getItem("sortOrder");
    params.sortBy = sortBySession || sortBy;
    params.sortOrder = sortOrderSession || sortOrder;
    // Filters
    const filtersSession = window.sessionStorage.getItem("filters");
    if (filtersSession) {
      const filters = JSON.parse(filtersSession);
      if (filters.genres && filters.genres.length > 0)
        params.genres = filters.genres.join(",");
      if (filters.platforms && filters.platforms.length > 0)
        params.platforms = filters.platforms.join(",");
      if (filters.developers && filters.developers.length > 0)
        params.developers = filters.developers.join(",");
      if (filters.publishers && filters.publishers.length > 0)
        params.publishers = filters.publishers.join(",");
      if (filters.yearRange) {
        params.yearMin = filters.yearRange[0];
        params.yearMax = filters.yearRange[1];
      }
      if (filters.ratingRange) {
        params.ratingMin = filters.ratingRange[0];
        params.ratingMax = filters.ratingRange[1];
      }
      if (filters.userStatus) {
        Object.entries(filters.userStatus).forEach(([key, val]) => {
          if (val) params[`userStatus_${key}`] = true;
        });
      }
    }
    return params;
  };

  // Local trigger for filter/sort changes (since sessionStorage event doesn't fire in same tab)
  const [updateFlag, setUpdateFlag] = useState(false);
  const triggerUpdate = () => setUpdateFlag((f) => !f);

  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      let endpoint = `/games/${activeTab}`;
      const params = getFilterAndSortParams();
      const queryString = Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
      try {
        const res = await fetch(
          baseUrl +
            endpoint +
            `?page=${page}&limit=${limit}` +
            (queryString ? `&${queryString}` : "")
        );
        const data = await res.json();
        setTotalPage(data.totalPages);
        setGames(data.games || []);
      } catch (err) {
        console.log(err);
        setGames([]);
      }
      setLoading(false);
    }
    fetchGames();
  }, [activeTab, baseUrl, page, limit, sortBy, sortOrder, updateFlag]);

  // Listen for changes in sessionStorage for sort/filter and trigger fetch
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'filters' || e.key === 'sortBy' || e.key === 'sortOrder') {
        setPage(1); // Optionally reset to first page on filter/sort change
        setUpdateFlag((f) => !f); // trigger fetch
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <MainNav />
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <span className="badge mb-2">DISCOVER</span>
            <h1 className="text-3xl font-bold text-white">Games Library</h1>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              className="btn btn-outline btn-icon"
              onClick={() => setShowSort(true)}
            >
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
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              <span className="sr-only">Sort</span>
            </button>
            <button
              className="btn btn-outline hidden md:flex items-center gap-2"
              onClick={() => setShowFilter(true)}
            >
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
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Sort Dialog */}
        {showSort && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSort(false)}
          >
            <div className="z-50" onClick={(e) => e.stopPropagation()}>
              <SortDialogBox
                sortBy={sortBy}
                sortOrder={sortOrder}
                handleSort={(field, order) => { handleSort(field, order); triggerUpdate(); }}
              />
            </div>
          </div>
        )}

        {/* Filter Dialog */}
        {showFilter && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFilter(false)}
          >
            <div className="z-50" onClick={(e) => e.stopPropagation()}>
              <FilterDialogBox onClose={() => { setShowFilter(false); triggerUpdate(); }} />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-[#151515] border border-[#252525] p-1 rounded-md flex">
            <button
              onClick={() => {
                setActiveTab("popular");
                setPage(1);
              }}
              className={`tab-button ${
                activeTab === "popular" ? "active" : ""
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => {
                setActiveTab("latest");
                setPage(1);
              }}
              className={`tab-button ${activeTab === "latest" ? "active" : ""}`}
            >
              Latest
            </button>
            <button
              onClick={() => {
                setActiveTab("upcoming");
                setPage(1);
              }}
              className={`tab-button ${
                activeTab === "upcoming" ? "active" : ""
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => {
                setActiveTab("top-rated");
                setPage(1);
              }}
              className={`tab-button ${
                activeTab === "top-rated" ? "active" : ""
              }`}
            >
              Top Rated
            </button>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="text-center text-white/70">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {games.map((game) => (
                  <GameCard key={game._id} game={game} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controller */}
        <div className="flex justify-center mt-12 space-x-3">
          <button
            disabled={page === 1}
            onClick={handleDecrement}
            className={`btn btn-neon px-6 py-2 w-28 ${
              page === 1 ? "!bg-purple-600 !cursor-not-allowed !opacity-60" : ""
            }`}
          >
            Previous
          </button>
          <button className="btn btn-neon px-6 py-2 w-12">{page}</button>
          <button
            disabled={page === totalPages}
            onClick={handleIncrement}
            className={`btn btn-neon px-6 py-2 w-28 ${
              page === totalPages
                ? "!bg-purple-600 !cursor-not-allowed !opacity-60"
                : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
