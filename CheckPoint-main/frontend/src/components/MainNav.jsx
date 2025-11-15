import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

export function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log(e);
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/sign-in');
  }

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="header">
      <div className="container header-container ">
        {/* Logo */}
        <div className="logo">
          <div className="logo-dots">
            <div className="logo-dot logo-dot-1 animate-pulse"></div>
            <div className="logo-dot logo-dot-2 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="logo-dot logo-dot-3 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <Link to="/">
            Check<span style={{ color: "#7000FF" }}>Point</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav">
          <Link to="/" className="nav-link">
            HOME
          </Link>
          <Link to="/games" className="nav-link">
            GAMES
          </Link>
          <Link to="/lists" className="nav-link">
            LISTS
          </Link>
        </nav>

        {/* Actions */}
        <div className={`actions ${theme === "light" ? "text-black" : "text-white"}`}> 
          <div className="relative w-full md:w-auto flex-1">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate('/search', { state: { searchQuery } });
                }
              }}
              placeholder="Search Games..."
              className={`input w-full md:w-[300px] !pr-10 ${theme === "light" ? "bg-white text-black border-gray-300" : "bg-[#151515] text-white border-[#252525]"}`}
            />
            <button
              onClick={() => navigate('/search', { state: { searchQuery: searchQuery } })}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === "light" ? "text-black" : "text-white"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={theme === "light" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          <button className={`btn btn-icon hidden md:flex ${theme === "light" ? "text-black hover:text-[#7000FF]" : "text-white hover:text-[#7000FF]"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="sr-only">Notifications</span>
          </button>
          {!isLoggedIn &&
            <div className="hidden md:flex items-center gap-2">
              <Link to="/sign-in">
                <button className="btn btn-outline">Sign In</button>
              </Link>
              <Link to="/create-account">
                <button className="btn btn-primary">Create Account</button>
              </Link>
            </div>
          }
          {isLoggedIn &&
            <>
              <div className="hidden md:flex items-center gap-2">
                <button onClick={handleLogout} className="btn btn-primary">Logout</button>
              </div>
              <button
                className="text-white hover:text-[#7000FF]"
                onClick={() => navigate('/profile')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="profile-icon"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>

                <span className="sr-only">Account</span>
              </button>
            </>
          }

          {/* Theme Toggle Button */}
          <button
            className="btn btn-outline mx-2"
            aria-label="Toggle dark/light mode"
            onClick={toggleTheme}
            style={{ minWidth: 40 }}
          >
            {theme === "dark" ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            className=" text-white hover:text-[#7000FF] md:hidden"
            onClick={() => isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span className="sr-only">Account</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="relative inset-0 z-50 bg-black/95 backdrop-blur-lg md:hidden">
          <div className="container h-full flex flex-col">
            <nav className="flex flex-col gap-1 py-6">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#252525] hover:text-[#7000FF] rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className="font-medium">Home</span>
              </Link>
              <Link
                to="/games"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#252525] hover:text-[#7000FF] rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="6" y1="11" x2="10" y2="11"></line>
                  <line x1="8" y1="9" x2="8" y2="13"></line>
                  <line x1="15" y1="12" x2="15.01" y2="12"></line>
                  <line x1="18" y1="10" x2="18.01" y2="10"></line>
                  <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path>
                </svg>
                <span className="font-medium">Games</span>
              </Link>
              <Link
                to="/lists"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#252525] hover:text-[#7000FF] rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <span className="font-medium">Lists</span>
              </Link>
            </nav>
            {!isLoggedIn &&
              <div className="mt-auto border-t border-[#252525] py-6 space-y-4">
                <Link
                  to="/sign-in"
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#252525] hover:text-[#7000FF] rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  to="/create-account"
                  className="flex items-center gap-3 px-4 py-3 bg-[#7000FF] text-white hover:bg-[#8A2BE2] rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  <span className="font-medium">Create Account</span>
                </Link>
              </div>
            }
            {isLoggedIn &&
              <Link
                className="flex items-center gap-3 px-4 py-3 bg-[#7000FF] text-white hover:bg-[#8A2BE2] rounded-lg transition-colors"
                onClick={(e) => {
                  handleLogout(e);
                  setIsMenuOpen(false);
                }}

              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                <span className="font-medium">Logout</span>
              </Link>

            }
          </div>
        </div>
      )}
    </header>
  )
}