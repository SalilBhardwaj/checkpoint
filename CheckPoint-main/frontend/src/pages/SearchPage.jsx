import React from "react";
import { useState, useEffect } from 'react';
import { SearchResultCard } from "../components/SearchResultCard";
import { useLocation } from 'react-router-dom';
import { MainNav } from "../components/MainNav";

function LoadingSkeleton() {
    return (
        <div className="flex bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800/50 animate-pulse">
            <div className="flex-shrink-0 w-24 h-32 sm:w-32 sm:h-40 bg-gray-800"></div>
            <div className="flex-1 p-4">
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/4 mb-4"></div>
                <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-800 rounded w-16"></div>
                    <div className="h-6 bg-gray-800 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-800 rounded w-1/5"></div>
            </div>
        </div>
    )
}

function EmptyState({ query }) {
    return (
        <div className="text-center py-16 bg-gray-900/30 rounded-lg border border-gray-800/50">
            <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
            <p className="text-gray-400">We couldn't find any games matching "{query}"</p>
            <p className="text-gray-500 mt-2 text-sm">Try using different keywords or check for typos</p>
        </div>
    )
}

export default function SearchPage() {
    const location = useLocation();
    const q = location.state?.searchQuery || "";
    const [games, setGames] = useState([]);
    const [searchQuery, setSearchQuery] = useState(q);
    const [isSearching, setIsSearching] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        setSearchQuery(location.state?.searchQuery || "");
    }, [location.state]);

    useEffect(() => {
        setIsSearching(true);
        const fetchgames = async () => {
            const response = await fetch(`${baseUrl}/search?q=${searchQuery}`);
            const data = await response.json();
            console.log(data);
            setGames(data.games);
        }
        fetchgames();
        setIsSearching(false);
        setHasSearched(true);
    }, [searchQuery, baseUrl]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">

            {/* Search Results */}
            <div className="space-y-4">
                {hasSearched && (
                    <div className="text-gray-400 mb-4">
                        {isSearching ? "Searching..." : `Found ${games.length} results for "${searchQuery}"`}
                    </div>
                )}

                {/* Loading State */}
                {isSearching && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <LoadingSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Results */}
                {/* {!isSearching && games.map((game) => <SearchResultCard key={game._id} game={game} />)} */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {!isSearching &&
                        games.map((game) => (
                            <SearchResultCard key={game._id} game={game} />
                        ))}
                </div>


                {/* Empty State */}
                {hasSearched && !isSearching && games.length === 0 && <EmptyState query={searchQuery} />}
            </div>
        </div>
    )
}
