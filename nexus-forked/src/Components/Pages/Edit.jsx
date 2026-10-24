import { useState } from "react";
import DesktopNav from "../Individual/DesktopNav";
import MobileMenu from "../Individual/MobileMenu";
import { ArrowLeft, Mail, Text, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ButtonSpinner from "../Individual/ButtonSpinner";

export default function EditPage() {
  const [Username, setUsername] = useState("");
  const [Bio, setBio] = useState("");
  const [Pfp, setPfp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = async () => {
    if (submitting) return;

    const formData = new FormData();
    formData.append("Pfp", Pfp);
    formData.append("Username", Username);
    formData.append("Bio", Bio);

    setSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/edit_profile`,
        {
          credentials: "include",
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div>
      <div className="min-h-screen bg-nexus-bg text-nexus-text transition-colors duration-300">
        {/* APP CONTAINER */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 pb-20 md:pb-6">
          {/* ================= 1. DESKTOP SIDEBAR ================= */}
          <DesktopNav />

          {/* ================= 2. MAIN PROFILE CONTENT ================= */}
          <main className="relative flex-1 min-w-0 bg-nexus-surface border border-nexus-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm flex justify-center items-center">
            <div
              onClick={() => navigate(-1)}
              className="absolute z-10 top-10 left-10 cursor-pointer"
            >
              <ArrowLeft />
            </div>

            <form className="space-y-5 w-1/2 mx-auto">
              <div className="relative">
                <User2
                  size={18}
                  className="absolute left-4 top-4 text-nexus-text-muted"
                />

                <input
                  placeholder="Profile picture"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setPfp(e.target.files[0])}
                  className="w-full rounded-xl border border-nexus-border bg-nexus-surface py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-nexus-primary file:mr-3 file:rounded-lg file:border-0 file:bg-nexus-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-nexus-text file:hover:bg-nexus-primary-hover"
                />
              </div>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-4 text-nexus-text-muted"
                />

                <input
                  type="text"
                  placeholder="Username"
                  value={Username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  className="w-full rounded-xl border border-nexus-border bg-nexus-surface py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-nexus-primary"
                />
              </div>

              <div className="relative">
                <Text
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-text-muted"
                />

                <input
                  type="text"
                  placeholder="Bio"
                  value={Bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                  }}
                  className="w-full rounded-xl border border-nexus-border bg-nexus-surface py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-nexus-primary"
                />
              </div>

              <button
                type="button"
                disabled={submitting}
                aria-busy={submitting}
                aria-label={submitting ? "Updating profile" : undefined}
                onClick={() => {
                  handleChange();
                }}
                className="flex w-full items-center justify-center rounded-xl bg-nexus-primary py-3 font-semibold text-nexus-text transition hover:bg-nexus-primary-hover hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <ButtonSpinner /> : "Update"}
              </button>
            </form>
          </main>

          {/* ================= 3. MOBILE BOTTOM NAVIGATION BAR ================= */}
          <MobileMenu />
        </div>
      </div>
    </div>
  );
}
