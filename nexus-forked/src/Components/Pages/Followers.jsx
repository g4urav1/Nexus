import { useContext, useEffect, useState } from "react";
import MobileMenu from "../Individual/MobileMenu";
import DesktopNav from "../Individual/DesktopNav";
import { AdminContext } from "../context/context";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfilePage() {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { Username } = useParams();
  const navigate = useNavigate();

  const { admin, setAdmin } = useContext(AdminContext);

  const handleFollow = async (userId, e) => {
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

      setFollowers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                isFollowing: data.isFollowing,
              }
            : user,
        ),
      );

      setAdmin({
        ...admin,
        isFollowing: data.isFollowing,
        Followers: data.Followers,
        FollowersCount: data.Followers.length,
      });
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  const getfollowers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/getFollowers/${encodeURIComponent(Username)}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        setFollowers([]);
        return;
      }

      setFollowers(data.result);
    } catch (error) {
      console.error("Failed to get Followers:", error);
      setFollowers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getfollowers();
  }, [Username]);

  return (
    <div>
      <div className="min-h-screen bg-nexus-bg text-nexus-text transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 pb-20 md:pb-6">
          <DesktopNav />

          <main className="flex-1 min-w-0 bg-nexus-surface border border-nexus-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4">
              {loading ? (
                <div className="text-center py-12 text-nexus-text-muted text-sm">
                  Loading followers...
                </div>
              ) : followers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {followers.map((follower) => (
                    <div
                      key={follower.id}
                      onClick={() => navigate(`/user/${follower.Follower}`)}
                      className="p-4 bg-nexus-surface-hover border border-nexus-border rounded-2xl flex items-center justify-between hover:border-nexus-primary/30 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            follower?.FollowerPfp ||
                            "https://i.pinimg.com/736x/02/59/54/0259543779b1c2db9ba9d62d47e11880.jpg"
                          }
                          alt={follower.Follower}
                          className="w-12 h-12 rounded-full object-cover"
                        />

                        <h3 className="text-sm font-bold text-nexus-text">
                          {follower.Follower}
                        </h3>
                      </div>

                      {follower.id !== admin._id && (
                        <button
                          onClick={(e) => {
                            handleFollow(follower.id, e);
                          }}
                          className={`px-4 py-2 sm:px-5 sm:py-2.5 font-semibold rounded-2xl text-xs sm:text-sm transition shadow-md active:scale-95 ${
                            follower.isFollowing
                              ? "bg-nexus-surface-hover text-nexus-text-secondary hover:bg-nexus-error/10 hover:text-nexus-error"
                              : "bg-nexus-primary hover:bg-nexus-primary-hover text-nexus-text shadow-sm shadow-nexus-primary/20"
                          }`}
                        >
                          {follower.isFollowing ? "UnFollow" : "Follow"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-nexus-text-muted text-sm">
                  No followers found.
                </div>
              )}
            </div>
          </main>

          <MobileMenu />
        </div>
      </div>
    </div>
  );
}
