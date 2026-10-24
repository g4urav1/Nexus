import { useState } from "react";
import DesktopNav from "../Individual/DesktopNav";
import MobileMenu from "../Individual/MobileMenu";
import { ArrowLeft, Image, Text } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ButtonSpinner from "../Individual/ButtonSpinner";

export default function EditPage() {
  const [Post, setPost] = useState(null);
  const [Caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!Post || submitting) {
      return;
    }

    const formData = new FormData();
    formData.append("image", Post);
    formData.append("caption", Caption);

    setSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/uploadmain`,
        {
          credentials: "include",
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
      }
      alert(data.message);
    } catch (error) {
      alert("something went wrong");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div>
      <div className="min-h-screen bg-nexus-bg text-nexus-text transition-colors duration-300">
        {/* APP CONTAINER */}
        <div className="max-w-7xl mx-auto flex min-h-screen flex-col md:flex-row gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 pb-20 md:pb-6">
          {/* ================= 1. DESKTOP SIDEBAR ================= */}
          <DesktopNav />

          {/* ================= 2. MAIN PROFILE CONTENT ================= */}
          <main className="relative flex min-h-[24rem] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-nexus-border bg-nexus-surface px-4 py-16 shadow-sm sm:rounded-3xl sm:px-8 sm:py-20 md:h-[calc(100vh-2rem)] md:min-h-0 lg:h-[calc(100vh-3rem)]">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => navigate(-1)}
              className="absolute left-4 top-4 z-10 cursor-pointer rounded-full p-2 text-nexus-text-muted transition hover:bg-nexus-surface-hover hover:text-nexus-text sm:left-6 sm:top-6"
            >
              <ArrowLeft />
            </button>

            <form className="mx-auto w-full max-w-md space-y-5">
              <div className="relative">
                <Image
                  size={18}
                  className="absolute left-4 top-4 text-nexus-text-muted"
                />

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setPost(e.target.files[0])}
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
                  placeholder="Caption"
                  value={Caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                  }}
                  className="w-full rounded-xl border border-nexus-border bg-nexus-surface py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-nexus-primary"
                />
              </div>

              <button
                type="button"
                disabled={!Post || submitting}
                aria-busy={submitting}
                aria-label={submitting ? "Creating post" : undefined}
                onClick={() => {
                  handleSubmit();
                }}
                className="flex w-full items-center justify-center rounded-xl bg-nexus-primary py-3 font-semibold text-nexus-text transition hover:bg-nexus-primary-hover hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <ButtonSpinner /> : "Post"}
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
