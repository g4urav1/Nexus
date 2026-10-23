import { useState } from "react";

export default function AuthPages() {
  const [darkMode, setDarkMode] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignUp ? "Signing up with:" : "Logging in with:", formData);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex items-center justify-center p-3 sm:p-6">
        {/* MAIN CONTAINER */}
        <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* ================= LEFT: HERO BRAND SECTION (Hidden on mobile) ================= */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 flex-col justify-between relative overflow-hidden text-white">
            {/* Background Decorative Circles */}
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-violet-400/20 blur-3xl"></div>

            {/* Brand Logo */}
            <div className="flex items-center space-x-3 z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-inner">
                N
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                Nexus.ui
              </span>
            </div>

            {/* Middle Feature Showcase Card */}
            <div className="space-y-6 z-10 my-auto py-8">
              <div className="p-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl space-y-3 shadow-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Sophia"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                  />
                  <div>
                    <p className="text-xs font-bold">Sophia Martinez</p>
                    <p className="text-[10px] text-indigo-200">
                      Product Designer
                    </p>
                  </div>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  "Nexus made building responsive dark-mode dashboards
                  effortless. Absolute game changer!"
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight">
                  Connect with creators worldwide.
                </h2>
                <p className="text-xs text-indigo-200 mt-2">
                  Join thousands of engineers and designers today.
                </p>
              </div>
            </div>

            {/* Footer Copy */}
            <div className="text-[11px] text-indigo-200/80 z-10">
              © {new Date().getFullYear()} Nexus.ui Inc. All rights reserved.
            </div>
          </div>

          {/* ================= RIGHT: AUTH FORM SECTION ================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between relative">
            {/* Header / Theme Switcher */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 lg:hidden">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md">
                  N
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  Nexus
                </span>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="ml-auto p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>

            {/* Form Box */}
            <div className="max-w-md w-full mx-auto space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {isSignUp ? "Create an account" : "Welcome back"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isSignUp
                    ? "Enter your details below to get started with Nexus."
                    : "Please enter your credentials to access your account."}
                </p>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-2 p-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
                <button className="flex items-center justify-center space-x-2 p-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 uppercase font-medium absolute">
                  or continue with
                </span>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Alex Chen"
                      required
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-none rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="alex@nexus.ui"
                    required
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-none rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {!isSignUp && (
                      <a
                        href="#forgot"
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Forgot?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-none rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 123c1.273-4.337 5.291-7.5 10.041-7.5s8.768 3.163 10.041 7.5c-1.273 4.337-5.291 7.5-10.041 7.5S3.309 16.337 2.036 12z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me / Terms Checkbox */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500/30 dark:bg-slate-800"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                  >
                    {isSignUp ? (
                      <>
                        I agree to the{" "}
                        <a
                          href="#terms"
                          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                        >
                          Terms & Conditions
                        </a>
                      </>
                    ) : (
                      "Remember me for 30 days"
                    )}
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition shadow-lg shadow-indigo-500/25 active:scale-95 mt-2"
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </button>
              </form>
            </div>

            {/* Switch Mode Footer */}
            <div className="text-center pt-6 text-xs text-slate-500 dark:text-slate-400">
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account yet?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
