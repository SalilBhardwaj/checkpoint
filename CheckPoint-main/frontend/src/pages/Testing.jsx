// UserProfile.js
import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:8000/profile');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Log to see the full response
        setProfileData(data.profile); // <--- Make sure you are setting data.profile
      } catch (err) {
        setError(err);
        console.error("Error fetching profile:", err); // Log the error
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Check if profileData exists and has favourites, and if favourites has items
  if (!profileData || !profileData.favourites || profileData.favourites.length === 0) {
    return <div>No favourite games found.</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <h2>Favorite Games</h2>
      <ul>
        {profileData.favourites.map((fav) => (
          // Use fav._id as the key for uniqueness
          <li key={fav._id}>
            Game ID: {fav.game ? fav.game : 'N/A'} - Added At: {new Date(fav.addedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfile;