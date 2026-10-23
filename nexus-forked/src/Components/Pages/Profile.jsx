import { useContext, useEffect, useState } from "react";

import MobileMenu from "../Individual/MobileMenu";

import DesktopNav from "../Individual/DesktopNav";

import { AdminContext } from "../context/context";

import { Heart } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

export default function ProfilePage() {

  const [activeTab, setActiveTab] = useState("posts");

  const { Username } = useParams();

  const [UserPosts, setUserPosts] = useState([]);

  const { admin, setAdmin } = useContext(AdminContext);

  const [accountUser, setAccountUser] = useState(null);

  const [isFollowing, setIsFollowing] = useState(false);

  const [likedPosts, setLikedPosts] = useState([]);

  const [conversationId, setConversationId] = useState("");

  const getLikedPosts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/likedPosts/${Username}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setLikedPosts(data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/${Username}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setAccountUser(data.user);

      setIsFollowing(data.isFollowing);

      setUserPosts(data.UserPosts);

      setConversationId(data.conversationId);

      getLikedPosts();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, [Username]);

  const formatPostTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // User details state
  const userArr = {
    name: "Alex Chen",
    handle: "@you_dev",
    role: "Product Designer & Frontend Engineer",
    bio: "Crafting pixel-perfect UI/UX systems & building with React, Tailwind CSS, and Framer Motion. 🚀",
    location: "San Francisco, CA",
    website: "https://alexchen.dev",
    joined: "Joined March 2023",
    following: 412,
    followers: "12.8k",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
    cover:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  };

  const handleLike = async (postId, e) => {
    e.stopPropagation();

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/likes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PostId: postId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setUserPosts((Posts) =>
        Posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                Likes: data.likes,
                isLiked: data.isLiked,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async (userId) => {
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
        isFollowing: data.isFollowing,
        Followers: data.Followers,
        FollowersCount: data.Followers.length,
      });

      getProfile();
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm("Do you want to Logout")) {
      await fetch(`${import.meta.env.VITE_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("adminId");
      navigate("/login");
    }

    return;
  };

  return (
    <div>
      <div className="min-h-screen bg-nexus-bg text-nexus-text transition-colors duration-300">
        {/* APP CONTAINER */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 pb-20 md:pb-6">
          {/* ================= 1. DESKTOP SIDEBAR ================= */}
          <DesktopNav />

          {/* ================= 2. MAIN PROFILE CONTENT ================= */}
          <main className="flex-1 min-w-0 bg-nexus-surface border border-nexus-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
            {/* Cover Image */}
            <div className="h-36 sm:h-52 lg:h-60 w-full relative bg-nexus-surface-hover overflow-hidden">
              <img
                src={userArr.cover}
                alt="Cover"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-nexus-bg/40 via-transparent to-transparent"></div>

              <button
                onClick={() => handleLogout()}
                className="md:hidden absolute top-3 right-3 p-2 bg-nexus-surface/60 backdrop-blur-md rounded-full text-nexus-text text-xs"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-box-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                  />
                </svg>
              </button>
            </div>

            {/* Profile Info Header */}
            <div className="px-4 sm:px-6 pb-4 relative">
              <div className="flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={
                      accountUser?.Pfp ||
                      "https://i.pinimg.com/736x/02/59/54/0259543779b1c2db9ba9d62d47e11880.jpg"
                    }
                    alt={accountUser?.Username || "loading..."}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-nexus-surface shadow-xl"
                  />

                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-nexus-success border-2 border-nexus-surface rounded-full absolute bottom-2 right-2"></span>
                </div>

                {/* Edit Profile Action */}
                {admin &&
                accountUser &&
                accountUser.Username === admin.Username ? (
                  <div className="space-x-4">
                    <button
                      onClick={() => (window.location.href = "/create/post")}
                      className="px-4 py-2 sm:px-5 sm:py-2.5 bg-nexus-primary hover:bg-nexus-primary-hover text-nexus-text font-semibold rounded-2xl text-xs sm:text-sm transition shadow-md active:scale-95"
                    >
                      Create Post
                    </button>

                    <button
                      onClick={() => (window.location.href = "/edit/profile")}
                      className="px-4 py-2 sm:px-5 sm:py-2.5 bg-nexus-primary hover:bg-nexus-primary-hover text-nexus-text font-semibold rounded-2xl text-xs sm:text-sm transition shadow-md active:scale-95"
                    >
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <div className="space-x-4">
                    <button
                      onClick={() =>
                        (window.location.href = `/inbox/${conversationId}`)
                      }
                      className="px-4 py-2 sm:px-5 sm:py-2.5 bg-nexus-primary hover:bg-nexus-primary-hover text-nexus-text font-semibold rounded-2xl text-xs sm:text-sm transition shadow-md active:scale-95"
                    >
                      Message
                    </button>

                    <button
                      onClick={() => {
                        handleFollow(accountUser._id);
                      }}
                      className={`px-4 py-2 sm:px-5 sm:py-2.5 font-semibold rounded-2xl text-xs sm:text-sm transition shadow-md active:scale-95 ${
                        isFollowing
                          ? "bg-nexus-surface-hover text-nexus-text-secondary hover:bg-nexus-error/10 hover:text-nexus-error"
                          : "bg-nexus-primary hover:bg-nexus-primary-hover text-nexus-text shadow-sm shadow-nexus-primary/20"
                      }`}
                    >
                      {isFollowing ? "UnFollow" : "Follow"}
                    </button>
                  </div>
                )}
              </div>

              {/* Identity & Bio */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-nexus-text leading-tight">
                    {accountUser?.Username || (
                      <p className="animate-pulse">loading...</p>
                    )}
                  </h1>

                  <p className="text-xs sm:text-sm text-nexus-text-secondary font-medium">
                    {accountUser?.Email || (
                      <span className="animate-pulse">loading...</span>
                    )}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-nexus-text-secondary leading-relaxed max-w-2xl">
                  {accountUser?.Bio || (
                    <span className="animate-pulse">loading...</span>
                  )}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-nexus-text-secondary pt-1">
                  <div className="flex items-center space-x-1">
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
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>

                    <span>{accountUser?.Joined}</span>
                  </div>
                </div>

                {/* Follower Stats */}
                <div className="flex space-x-5 pt-1 text-xs sm:text-sm">
                  <div
                    onClick={() =>
                      (window.location.href = `/Following/${Username}`)
                    }
                    className="cursor-pointer"
                  >
                    <span className="font-bold text-nexus-text">
                      {accountUser?.FollowingCount}
                    </span>{" "}
                    <span className="text-nexus-text-secondary">Following</span>
                  </div>

                  <div
                    onClick={() =>
                      (window.location.href = `/Followers/${Username}`)
                    }
                    className="cursor-pointer"
                  >
                    <span className="font-bold text-nexus-text">
                      {accountUser?.FollowersCount}
                    </span>{" "}
                    <span className="text-nexus-text-secondary">Followers</span>
                  </div>

                  <div>
                    <span className="font-bold text-nexus-text">
                      {UserPosts.length}
                    </span>{" "}
                    <span className="text-nexus-text-secondary">Posts</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-nexus-border mt-6 text-xs sm:text-sm font-semibold">
                {["posts", "media", "likes"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-4 capitalize relative transition ${
                      activeTab === tab
                        ? "text-nexus-primary font-bold"
                        : "text-nexus-text-secondary hover:text-nexus-text"
                    }`}
                  >
                    {tab}

                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-nexus-primary rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Feed Content */}
            <div className="p-4 sm:p-6 space-y-4 bg-nexus-surface-hover/50">
              {activeTab === "posts" &&
                UserPosts.length === 0 &&
                "NO POSTS YET!"}

              {activeTab === "posts" &&
                UserPosts.length > 0 &&
                UserPosts.map((post) => (
                  <article
                    key={post._id}
                    onClick={() => {
                      console.log("CLICKED POST:", post);
                      console.log("POST ID:", post._id);
                      window.location.href = `/post/${post._id}`;
                    }}
                    className="bg-nexus-surface rounded-3xl p-5 border border-nexus-border shadow-sm hover:border-nexus-primary/30 transition-all duration-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            accountUser?.Pfp ||
                            "https://i.pinimg.com/736x/02/59/54/0259543779b1c2db9ba9d62d47e11880.jpg"
                          }
                          alt={
                            accountUser?.Username || (
                              <p className="animate-pulse">loading...</p>
                            )
                          }
                          className="w-10 h-10 rounded-full object-cover"
                        />

                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-nexus-text leading-tight">
                            {accountUser?.Username || (
                              <p className="animate-pulse">loading...</p>
                            )}
                          </h4>

                          <span className="text-[11px] text-nexus-text-muted">
                            {formatPostTime(post.UploadedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-nexus-text leading-relaxed">
                      {post.Caption}
                    </p>

                    {post.Url && (
                      <div className="rounded-2xl overflow-hidden border border-nexus-border">
                        <img
                          src={post.Url}
                          alt="Post media"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-6 text-nexus-text-muted text-xs pt-2">
                      <button
                        onClick={(e) => handleLike(post._id, e)}
                        className={`flex items-center space-x-1.5 transition ${
                          post.isLiked
                            ? "text-nexus-like"
                            : "hover:text-nexus-like"
                        } font-bold`}
                      >
                        <Heart
                          size={14}
                          fill={post.isLiked ? "currentColor" : "none"}
                        />

                        <span>{post.Likes}</span>
                      </button>

                      <button className="flex items-center space-x-1.5 hover:text-nexus-primary transition">
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
                            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.585 1.659l-.48 1.921 2.03-.406c.552-.11 1.115.08 1.542.418A8.93 8.93 0 0012 20.25z"
                          />
                        </svg>

                        <span>{post.CommentCount}</span>
                      </button>
                    </div>
                  </article>
                ))}

              {activeTab === "media" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {UserPosts.map((src) => (
                    <div
                      key={src._id}
                      className="aspect-square rounded-2xl overflow-hidden bg-nexus-surface-hover border border-nexus-border"
                    >
                      <img
                        src={src.Url}
                        alt="Media thumbnail"
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "likes" &&
                likedPosts.length === 0 &&
                "NO Liked POSTS YET!"}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeTab === "likes" &&
                  likedPosts.length > 0 &&
                  likedPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => {
                        console.log("CLICKED POST:", post);
                        console.log("POST ID:", post.id);

                        window.location.href = `/post/${post.id}`;
                      }}
                      className="aspect-square rounded-2xl overflow-hidden bg-nexus-surface-hover border border-nexus-border"
                    >
                      {post.url && (
                        <div className="aspect-square rounded-2xl overflow-hidden bg-nexus-surface-hover border border-nexus-border">
                          <img
                            src={post.url}
                            alt="Post media"
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </main>

          {/* ================= 3. MOBILE BOTTOM NAVIGATION BAR ================= */}
          <MobileMenu />
        </div>
      </div>
    </div>
  );
}
