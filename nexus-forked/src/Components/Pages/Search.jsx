import { useContext, useEffect, useState } from "react";
import MobileMenu from "../Individual/MobileMenu";
import DesktopNav from "../Individual/DesktopNav";
import { AdminContext, ThemeContext } from "../context/context";

export default function SearchPage() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [people, setPeople] = useState([]);

  const { admin, setAdmin } = useContext(AdminContext);

  const searchPeople = async (e) => {
    const query = e.target.value;

    setSearchQuery(query);

    if (query.trim() === "") {
      return setPeople([]);
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/searchUsers?searchQuery=${query}`,
      {
        credentials: "include",
      },
    );

    const data = await response.json();

    setPeople(data);
  };

  useEffect(() => {
    searchPeople({ target: { value: searchQuery } });
  }, [admin]);

  const handleFollow = async (e, userId) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/follow`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      setAdmin({
        ...admin,
        Followers: data.Followers,
        FollowersCount: data.Followers.length,
      });
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-nexus-bg text-nexus-text transition-colors duration-300">
        {/* APP CONTAINER */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 pb-20 md:pb-6">
          {/* ================= 1. DESKTOP SIDEBAR ================= */}

          <DesktopNav />

          {/* ================= 2. MAIN SEARCH CONTENT ================= */}
          <main className="flex-1 min-w-0 bg-nexus-surface border border-nexus-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
            {/* Header & Search Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-nexus-text">
                    Find Creators & Friends
                  </h1>
                  <p className="text-xs sm:text-sm text-nexus-text-secondary">
                    Discover designers, developers, and colleagues
                  </p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="md:hidden p-2 text-nexus-text-secondary hover:text-nexus-primary"
                >
                  {darkMode ? "☀️" : "🌙"}
                </button>
              </div>

              {/* Dynamic Input Bar */}
              <div className="relative">
                <svg
                  className="w-5 h-5 absolute left-4 top-3.5 text-nexus-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={searchPeople}
                  placeholder="Search by name, handle, or role..."
                  className="w-full pl-11 pr-4 py-3 bg-nexus-surface-hover border-none rounded-2xl text-xs sm:text-sm text-nexus-text placeholder:text-nexus-text-muted focus:outline-none focus:ring-2 focus:ring-nexus-primary/40 transition"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {people.length > 0 ? (
                people.map((person) => (
                  <div
                    key={person._id}
                    onClick={() =>
                      (window.location.href = `/user/${person.Username}`)
                    }
                    className="p-4 bg-nexus-surface-hover border border-nexus-border rounded-2xl flex flex-col justify-between space-y-3 hover:border-nexus-primary/30 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            person?.Pfp ||
                            "https://i.pinimg.com/736x/02/59/54/0259543779b1c2db9ba9d62d47e11880.jpg"
                          }
                          alt={person.Username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-nexus-text">
                            {person.Username}
                          </h3>
                          <p className="text-xs text-nexus-text-muted">
                            {person.Email}
                          </p>
                        </div>
                      </div>

                      {/* Follow / Unfollow Button */}

                      {person._id !== admin._id && (
                        <button
                          onClick={(e) => {
                            handleFollow(e, person._id);
                          }}
                          className={`px-4 py-2 sm:px-5 sm:py-2.5 font-semibold rounded-2xl text-xs sm:text-sm transition shadow-md active:scale-95  ${
                            person.isFollowing
                              ? "bg-nexus-surface-hover text-nexus-text-secondary hover:bg-nexus-error/10 hover:text-nexus-error"
                              : "bg-nexus-primary hover:bg-nexus-primary-hover text-nexus-text shadow-sm shadow-nexus-primary/20"
                          }`}
                        >
                          {person.isFollowing ? "UnFollow" : "Follow"}
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-nexus-text-secondary leading-relaxed line-clamp-2">
                      {person.Bio}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-nexus-text-muted text-xs">
                  No friends or creators found.
                </div>
              )}
            </div>
          </main>

          {/* ================= 3. MOBILE BOTTOM NAVIGATION BAR ================= */}

          <MobileMenu />
        </div>
      </div>
    </div>
  );
}
