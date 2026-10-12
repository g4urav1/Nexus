import { FaInstagram as Instagram } from "react-icons/fa";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [Password, setPassword] = useState("");

  const [UserName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem("Username"));
  }, [UserName]);

  const changePassword = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/changePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserName,
            Password,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        localStorage.removeItem("Username");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-bg flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-nexus-surface">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-nexus-primary via-nexus-secondary to-nexus-accent p-12 text-nexus-text relative overflow-hidden">
          <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-nexus-surface/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-nexus-surface/10 blur-3xl" />

          <div className="relative">
            <Instagram size={50} />
            <h1 className="text-5xl font-bold mt-6">
              Connect.
              <br />
              Share.
              <br />
              Inspire.
            </h1>

            <p className="mt-6 text-nexus-text/80 text-lg leading-relaxed">
              Discover amazing creators and connect with your friends in one
              beautiful place.
            </p>
          </div>

          <div className="relative flex gap-3">
            <img
              src="https://i.pravatar.cc/60?img=1"
              className="rounded-full border-4 border-nexus-surface"
            />
            <img
              src="https://i.pravatar.cc/60?img=2"
              className="rounded-full border-4 border-nexus-surface -ml-4"
            />
            <img
              src="https://i.pravatar.cc/60?img=3"
              className="rounded-full border-4 border-nexus-surface -ml-4"
            />
            <span className="ml-4 text-nexus-text/80 self-center">
              Join 50k+ creators
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-14">
          <div className="text-center mb-10">
            <Instagram className="mx-auto text-nexus-primary" size={42} />

            <h2 className="text-3xl font-bold mt-4">Reset Your Password?</h2>

            <p className="text-nexus-text-secondary mt-2">set new password.</p>
          </div>

          <form className="space-y-5">
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-4 text-nexus-text-muted"
              />

              <input
                disabled
                type="text"
                placeholder="Username"
                value={UserName}
                className="w-full rounded-xl border border-nexus-border bg-nexus-surface-hover py-3 pl-12 pr-4 outline-none text-nexus-text-muted"
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-nexus-border bg-nexus-surface py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-nexus-primary"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-nexus-text-muted hover:text-nexus-text"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                changePassword();
              }}
              className="w-full rounded-xl bg-gradient-to-r from-nexus-primary to-nexus-secondary py-3 font-semibold text-nexus-text transition hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Change
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="h-px flex-1 bg-nexus-border" />
            <span className="px-4 text-nexus-text-secondary text-sm">OR</span>
            <div className="h-px flex-1 bg-nexus-border" />
          </div>

          <p className="mt-8 text-center text-nexus-text-secondary">
            Don't have an account?
            <a
              href="signup"
              className="ml-2 font-semibold text-nexus-primary hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
