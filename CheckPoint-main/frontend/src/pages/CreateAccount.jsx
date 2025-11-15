import { Link } from "react-router-dom"
import { MainNav } from "../components/MainNav"
import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CreateAccount() {
  const [error, setError] = useState("");
  const [clicked, setClicked] = useState(false);

  const navigate = useNavigate();

  const email = useRef();
  const password = useRef();
  const username = useRef();
  const name = useRef();
  const confirmPassword = useRef();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const clearValues = () => {
    email.current.value = "";
    password.current.value = "";
    username.current.value = "";
    name.current.value = "";
    confirmPassword.current.value = "";
    return;
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (confirmPassword.current.value !== password.current.value) {
      setError("Password and Confirm Password Do Not Match.");
      return;
    }
    setClicked(true);
    try {
      const response = await fetch(`${baseUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.current.value,
          password: password.current.value,
          username: username.current.value,
          name: name.current.value,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(`Error Occurred: ${data.message}`);
        setClicked(false);
        return;
      }
      setError("Account Created Successfully.");
      clearValues();
      setClicked(false);

      setTimeout(() => {
        navigate('/sign-in');
      }, 2000);
    }
    catch (e) {
      setError("An unexpected error occurred.");
      setClicked(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-10 bg-black">
        <MainNav />
      </div>

      {/* Main Content */}
      <div
        className="flex flex-1"
        style={{
          backgroundImage: "url('/signUpBg.webp')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          width: "100vw",
          height: "100vh",
          marginTop: "64px"
        }}
      >
        {/* Right side with form */}
        <div className="w-full md:w-1/2 flex items-center justify-center ml-auto">
          <div className="form-card w-full max-w-md bg-black/80 rounded-lg shadow-lg p-8">
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-sm text-white/70">Enter your information to create your account</p>
            </div>
            <form className="space-y-4" onSubmit={handleCreateAccount}>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <input ref={username} id="username" placeholder="gamerguy42" required className="input w-full" />
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input ref={name} id="name" placeholder="Aditya Kr Singh" required className="input w-full" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input ref={email} id="email" type="email" placeholder="m@example.com" required className="input w-full" />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input ref={password} id="password" type="password" required className="input w-full" />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  Confirm Password
                </label>
                <input ref={confirmPassword} id="confirm-password" type="password" required className="input w-full" />
              </div>
              <div className="text-red-500">
                {error && <pre>{error}</pre>}
              </div>
              <button
                type="submit"
                disabled={clicked}
                className="btn btn-primary py-2 w-full"
              >
                {clicked ? "Creating..." : "Create account"}
              </button>
            </form>
            <div className="text-sm text-center text-white/70 mt-4">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-[#7000FF] hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}