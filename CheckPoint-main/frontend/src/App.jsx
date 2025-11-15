import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

// Pages
import Home from "./pages/Home"
import Games from "./pages/Games"
import GameDetail from "./pages/GameDetail"
import SignIn from "./pages/SignIn"
import CreateAccount from "./pages/CreateAccount"
import Profile from "./pages/Profile"
import ReviewsRating from "./pages/ReviewsRating"
import Testing from "./pages/Testing"
import ForgotPassword from "./pages/ForgotPassword"
import SearchPage from "./pages/SearchPage"
import Lists from "./pages/Lists";
import { MainNav } from "./components/MainNav"
import UserProfile from "./pages/UserProfile";
import ListDetails from "./pages/ListDetails";

function App() {
  const [theme, setTheme] = useState(() => {
    // Try to get theme from localStorage, default to 'dark'
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "light";
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/lists" element={<Lists/>} />
          <Route path="/lists/:id" element={<ListDetails/>} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/reviews/:id" element={<ReviewsRating />} />
          <Route path="/testing" element={<Testing/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/search" element={<><MainNav/><SearchPage/></>}/>
        </Routes>
      </Router>
    </ThemeContext.Provider>
  )
}

export default App