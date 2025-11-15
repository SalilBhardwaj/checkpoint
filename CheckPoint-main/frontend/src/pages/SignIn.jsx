import { Link } from "react-router-dom"
import { MainNav } from "../components/MainNav"
import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const accountId = useRef(null);
  const password = useRef(null);
  const [error, setError] = useState(null);
  const [clicked, setClicked] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const clearValues = () => {
    accountId.current.value = "";
    password.current.value = "";
    return;
  }

  const handleLogin = async (e) => {
    // console.log("login");
    e.preventDefault();
    setClicked(true);

    const response = await fetch(`${baseUrl}/signin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: accountId.current.value,
        password: password.current.value,
      })
    });

    // const data = await response.json();

    const data = await response.json();
    console.log(data);
    console.log(data.user);
    if (!response.ok) {
      setError(`Error: ${data.message}`);
      setClicked(false);
      return;
    }
    clearValues();
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.user.token);

    navigate('/profile');
    setClicked(false);
  }


  return (
    <div className="min-h-screen bg-black text-white">
      <MainNav />
      <div className="container flex items-center justify-center min-h-[calc(100vh-64px)] py-12">
        <div className="form-card w-full max-w-md">
          <div className="space-y-1 mb-6">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <p className="text-sm text-white/70">Enter your email and password to access your account</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email or Username
              </label>
              <input ref={accountId} id="email" type="email" placeholder="m@example.com or gamerguy34" required className="input" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-[#7000FF] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input ref={password} id="password" type="password" required className="input" />
            </div>
            <div >
              {error && <pre className="text-red">{`${error}`}</pre>}
            </div>
          </div>
          <div className="flex flex-col space-y-4 mt-6">
            <button onClick={handleLogin} disabled={clicked} className="btn btn-primary py-2">{ clicked ? "Signing in..." : "Sign in"}</button>
            <div className="text-sm text-center text-white/70">
              Don&apos;t have an account?{" "}
              <Link to="/create-account" className="text-[#7000FF] hover:underline">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
