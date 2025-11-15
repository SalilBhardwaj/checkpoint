import { Link } from "react-router-dom"
import { useState, useEffect } from "react";

export function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(()=>{
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if(user && token){
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
    }
  },[]);

  return (
    <section className="hero-section">
      {/* Background image with color grading overlay */}
      <div className="hero-background">
        <img src="/game-cover.jpeg" alt="Hero background" className="object-cover w-full h-full" />
      </div>

      {/* Color grading overlays */}
      <div className="hero-overlay"></div>
      <div className="hero-glow"></div>
      <div className="hero-grid"></div>

      {/* Content */}
      <div className="hero-content" style={{ color: '#fff' }}>
        <h1 className="hero-title">
          <span className="block mb-2" style={{ color: '#fff' }}>Track games you've</span>
          <span className="block mb-2 text-gradient animate-gradient-shift" style={{ color: '#fff' }}>played.</span>
          <span className="block mb-2" style={{ color: '#fff' }}>Save those you want to</span>
          <span className="block mb-2 text-gradient animate-gradient-shift" style={{ color: '#fff' }}>play.</span>
          <span className="block mb-2" style={{ color: '#fff' }}>Tell your friends what's</span>
          <span className="block text-gradient animate-gradient-shift" style={{ color: '#fff' }}>good.</span>
        </h1>

        <p className="hero-description" style={{ color: '#fff' }}>
          Join the ultimate social network for gamers. Track your gaming journey, discover new titles, and connect with
          a community that shares your passion.
        </p>

        <Link to={isLoggedIn ? "/games" : "/create-account"}>
          <button className="btn btn-neon group px-6 py-3 text-lg font-medium">
            Get started — it's free!
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
              className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </Link>

        <div className="hero-stats">
          <div className="hero-stat">
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
              className="hero-stat-icon"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span className="text-lg">10K+ Games</span>
          </div>
          <div className="hero-stat">
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
              className="hero-stat-icon"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            <span className="text-lg">500K+ Users</span>
          </div>
          <div className="hero-stat">
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
              className="hero-stat-icon"
            >
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
            <span className="text-lg">1M+ Reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}