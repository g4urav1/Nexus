import { FaInstagram as Instagram } from "react-icons/fa";
import { Mail, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonSpinner from "../Individual/ButtonSpinner";

export default function ForgetPasswordPage() {
  const [btnDisable, setBtnDisable] = useState(true);
  const [codeDisable, setCodeDisable] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [UserName, setUserName] = useState("");
  const [Code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!UserName) {
      setCodeDisable(true);
    } else {
      setCodeDisable(false);
    }
  }, [UserName]);

  useEffect(() => {
    if (!UserName || !Code) {
      setBtnDisable(true);
    } else {
      setBtnDisable(false);
    }
  }, [UserName]);

  const getCode = async () => {
    if (UserName.trim() == "") {
      return alert("Enter Username first");
    }
    setSending(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/getCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: UserName,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setBtnDisable(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async () => {
    setVerifying(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/verifyCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserName: UserName,
            Code: Code,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("Username", UserName);
        alert(data.message);
        navigate("/reset-password");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setVerifying(false);
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

            <h2 className="text-3xl font-bold mt-4">Forgot Your Password?</h2>

            <p className="text-nexus-text-secondary mt-2">Lets get back in.</p>
          </div>

          <form className="space-y-5">
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-4 text-nexus-text-muted"
              />

              <input
                type="text"
                placeholder="Username"
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-xl border border-nexus-border bg-nexus-surface-hover py-3 pl-12 pr-4 outline-none focus:border-nexus-primary focus:ring-2 focus:ring-nexus-primary/20"
              />
            </div>

            <div className="relative">
              <Key
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted"
              />

              <input
                disabled={codeDisable}
                title={codeDisable ? "get code first" : ""}
                type="text"
                placeholder="Code"
                value={Code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-nexus-border bg-nexus-surface py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-nexus-primary"
              />
            </div>

            {btnDisable ? (
              <button
                type="button"
                disabled={sending}
                aria-busy={sending}
                aria-label={sending ? "Sending code" : undefined}
                onClick={() => {
                  getCode();
                }}
                className={`w-full flex items-center justify-center rounded-xl bg-nexus-primary py-3 font-semibold text-nexus-text transition hover:bg-nexus-primary-hover hover:scale-[1.02] active:scale-95 cursor-pointer`}
              >
                {sending ? (
                  <ButtonSpinner />
                ) : (
                  "Get Code"
                )}
              </button>
            ) : (
              <button
                type="button"
                disabled={verifying}
                aria-busy={verifying}
                aria-label={verifying ? "Verifying code" : undefined}
                onClick={() => {
                  verifyCode();
                }}
                className={`w-full flex items-center justify-center rounded-xl bg-nexus-primary py-3 font-semibold text-nexus-text transition hover:bg-nexus-primary-hover hover:scale-[1.02] active:scale-95 cursor-pointer`}
              >
                {verifying ? <ButtonSpinner /> : "verify"}
              </button>
            )}
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
