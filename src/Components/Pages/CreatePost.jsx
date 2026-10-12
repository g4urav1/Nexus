import { useState } from "react";
import DesktopNav from "../Individual/DesktopNav";
import MobileMenu from "../Individual/MobileMenu";
import { ArrowLeft, Image, Text } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditPage() {
  const [Post, setPost] = useState(null);
  const [Caption, setCaption] = useState("");

  const handleSubmit = async () => {
    if (!Post) {
      return;
    }

    const formData = new FormData();
    formData.append("image", Post);
    formData.append("caption", Caption);

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
                onClick={() => {
                  handleSubmit();
                }}
                className="w-full rounded-xl bg-nexus-primary py-3 font-semibold text-nexus-text transition hover:bg-nexus-primary-hover hover:scale-[1.02] active:scale-95"
              >
                Post
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
