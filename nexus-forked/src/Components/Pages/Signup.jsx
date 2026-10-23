import { Camera, Check, Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const [disable, setDisable] = useState(true);
  const [error, setError] = useState(false);

  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const usernameAvailability = async (username) => {
    if (!username.trim()) {
      setUsernameAvailable(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/usernameAvailability?username=${encodeURIComponent(username)}`,
      );

      const data = await response.json();

      console.log(username);
      console.log(data);

      setUsernameAvailable(data.isAvailable);
    } catch (error) {
      console.error("Username availability error:", error);
      setUsernameAvailable(null);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fieldsEmpty = !Username || !Email || !Password || !ConfirmPassword;

    const passwordsDontMatch =
      ConfirmPassword !== "" && Password !== ConfirmPassword;

    setError(passwordsDontMatch);

    setDisable(fieldsEmpty || passwordsDontMatch);
  }, [Username, Email, Password, ConfirmPassword]);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: Username,
          Email: Email,
          Password: Password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/login");
      } else {
        alert("server error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nexus-bg px-4 py-8 text-nexus-text">
      <div className="w-full max-w-md rounded-3xl bg-nexus-surface border border-nexus-border p-8 shadow-2xl text-nexus-text">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-nexus-primary via-nexus-secondary to-nexus-accent flex items-center justify-center shadow-lg">
            <Camera className="text-white" size={30} />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-nexus-text">
            Create Account
          </h1>

          <p className="mt-2 text-center text-sm text-nexus-text-secondary">
            Join thousands of creators and start sharing today.
          </p>
        </div>

        {/* Avatar */}
        <div className="mt-8 flex justify-center">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Avatar"
              className="h-24 w-24 rounded-full object-cover ring-4 ring-nexus-primary/20"
            />

            <button
              type="button"
              className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-gradient-to-r from-nexus-primary to-nexus-secondary flex items-center justify-center shadow-lg text-white hover:scale-105 transition"
            >
              <Camera size={18} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-4">
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted"
            />

            <input
              type="text"
              value={Username}
              onChange={(e) => {
                const username = e.target.value
                  .toLowerCase()
                  .replace(/ /g, "_");

                setUsername(username);
                usernameAvailability(username);
              }}
              placeholder="Username"
              className="w-full rounded-xl border border-nexus-border bg-nexus-surface-hover text-nexus-text placeholder:text-nexus-text-muted py-3 pl-11 pr-11 outline-none focus:ring-2 focus:ring-nexus-primary"
            />

            <p className="absolute right-4 top-1/2 -translate-y-1/2">
              {usernameAvailable === false ? (
                <X size={18} className="text-nexus-error" />
              ) : usernameAvailable === true ? (
                <Check size={18} className="text-nexus-success" />
              ) : null}
            </p>
          </div>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted"
            />

            <input
              type="email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-nexus-border bg-nexus-surface-hover text-nexus-text placeholder:text-nexus-text-muted py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-nexus-primary"
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-nexus-border bg-nexus-surface-hover text-nexus-text placeholder:text-nexus-text-muted py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-nexus-primary"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-nexus-text-muted hover:text-nexus-text"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative mt-4">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted"
            />

            <input
              type={showConfirmPassword ? "text" : "password"}
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full rounded-xl border border-nexus-border bg-nexus-surface-hover text-nexus-text placeholder:text-nexus-text-muted py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-nexus-primary"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-nexus-text-muted hover:text-nexus-text"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {error && (
              <p className="text-nexus-error absolute text-sm left-2">
                Passwords don't match
              </p>
            )}
          </div>

          <label className="flex items-start gap-3 text-sm text-nexus-text-secondary pt-4">
            <input type="checkbox" className="mt-1 accent-nexus-primary" />

            <span>
              I agree to the{" "}
              <button
                type="button"
                className="text-nexus-primary hover:underline"
              >
                Terms
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-nexus-primary hover:underline"
              >
                Privacy Policy
              </button>
            </span>
          </label>

          <button
            type="button"
            disabled={disable}
            onClick={(e) => handleSignup(e)}
            className={`w-full rounded-xl bg-gradient-to-r from-nexus-primary via-nexus-secondary to-nexus-accent py-3 font-semibold text-white shadow-lg hover:opacity-90 transition ${
              disable ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            Create Account
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-nexus-border" />
          <span className="text-xs text-nexus-text-muted uppercase">or</span>
          <div className="h-px flex-1 bg-nexus-border" />
        </div>

        <button
          type="button"
          className="w-full rounded-xl border border-nexus-border bg-nexus-surface text-nexus-text py-3 font-medium hover:bg-nexus-surface-hover transition"
        >
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-nexus-text-secondary">
          Already have an account?
          <a
            href="/login"
            className="ml-2 font-semibold text-nexus-primary hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
