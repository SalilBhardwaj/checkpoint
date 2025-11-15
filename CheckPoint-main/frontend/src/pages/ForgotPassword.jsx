import React, { useRef, useState } from "react";
import { MainNav } from "../components/MainNav";

export default function ForgotPassword() {
  const emailRef = useRef();
  const otpRef = useRef();
  const passwordRef = useRef();
  const [step, setStep] = useState(1); // 1: email, 2: otp+password
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // Simulate backend endpoints
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const emailValue = emailRef.current.value.trim();
    if (!emailValue) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }
    setEmail(emailValue);

    try {
      const response = await fetch(`${baseUrl}/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send OTP. Please try again.");
        setLoading(false);
        return;
      }

      // Show success message and move to next step
      setError(""); // Clear any previous errors
      setSuccess(data.message || "Token sent successfully!");
      setStep(2);
      setLoading(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const otp = otpRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    if (!otp || !password) {
      setError("Please enter the token and your new password.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/reset-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: otp,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to reset password. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MainNav />
      <div
        className="flex flex-1 items-center justify-center"
        style={{ marginTop: 64 }}
      >
        <div className="form-card w-full max-w-md bg-[#151515] border border-[#252525] rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
          {submitted ? (
            <div className="text-green-400 text-center font-semibold">
              Your password has been reset. You can now sign in with your new
              password.
            </div>
          ) : (
            <>
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      ref={emailRef}
                      className="input w-full bg-black border border-[#252525] rounded p-2 text-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {error && <div className="text-red-400 text-sm">{error}</div>}
                  {success && (
                    <div className="text-green-400 text-sm">{success}</div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary w-full py-2 text-lg"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label htmlFor="otp" className="block mb-2 font-medium">
                      Enter reset token sent to{" "}
                      <span className="text-[#7000FF]">{email}</span>
                    </label>
                    <p className="text-sm text-gray-400 mb-2">
                      Check your email for a token. Copy and paste it here.
                    </p>
                    <input
                      id="otp"
                      type="text"
                      ref={otpRef}
                      className="input w-full bg-black border border-[#252525] rounded p-2 text-white font-mono"
                      placeholder="Enter the token from your email"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block mb-2 font-medium"
                    >
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      ref={passwordRef}
                      className="input w-full bg-black border border-[#252525] rounded p-2 text-white"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  {error && <div className="text-red-400 text-sm">{error}</div>}
                  <button
                    type="submit"
                    className="btn btn-primary w-full py-2 text-lg"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
