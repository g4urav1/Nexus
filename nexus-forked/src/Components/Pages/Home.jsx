import { useContext, useEffect, useState } from "react";
import DesktopNav from "../Individual/DesktopNav";
import MobileMenu from "../Individual/MobileMenu";
import { AdminContext } from "../context/context";
import { Heart } from "lucide-react";
import ButtonSpinner from "../Individual/ButtonSpinner";

export default function FeedPage({ socket }) {
  const { admin } = useContext(AdminContext);

  const [posts, setPosts] = useState([]);

  const getFeed = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}`, {
      credentials: "include",
    });
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("getFeed", () => {
      getFeed();
    });
  }, [socket]);

  const handleCreatePost = async () => {
    if (!NewPost) {
      return;
    }

    const formData = new FormData();
    formData.append("image", NewPost);
    formData.append("caption", Caption);

    setSending(true);

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
      getFeed();
    } catch (error) {
      alert("something went wrong");
      console.error(error);
    } finally {
      setSending(false);
      setNewPost(null);
      setPreview(null);
      setCaption("");
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

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

  const [NewPost, setNewPost] = useState(null);
  const [Caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [sending, setSending] = useState(false);

  const handleLike = async (postId) => {
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

      setPosts((Posts) =>
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

  useEffect(() => {
    if (!socket) return;

    const handleLikes = ({ postId, likes }) => {
      setPosts((posts) =>
        posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                Likes: likes,
              }
            : post,
        ),
      );
    };

    socket.on("getLikes", handleLikes);

    return () => {
      socket.off("getLikes", handleLikes);
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-nexus-bg text-nexus-text transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* ================= 1. SIDEBAR NAVIGATION ================= */}
        <DesktopNav />

        {/* ================= 2. MAIN FEED STREAM ================= */}
        <main className="mb-10 max-w-2xl flex-1 space-y-5">
          {/* --- CREATE POST CARD --- */}
          <div className="rounded-3xl border border-nexus-border bg-nexus-surface p-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-nexus-primary/20">
            <form>
              <div className="flex gap-3">
                <img
                  src={
                    admin?.Pfp ||
                    "https://i.pinimg.com/736x/02/59/54/0259543779b1c2db9ba9d62d47e11880.jpg"
                  }
                  alt="Your Avatar"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-nexus-primary/20"
                />

                <textarea
                  rows={3}
                  value={Caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Create a new post?"
                  className="w-full resize-none border-none bg-transparent pt-1 text-sm text-nexus-text placeholder-nexus-text-muted focus:outline-none focus:ring-0"
                />

                {preview && (
                  <div className="mt-3">
                    <img
                      src={preview}
                      alt="Post preview"
                      className="max-h-36 w-full rounded-xl object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-nexus-border pt-3">
                <div className="flex items-center space-x-1">
                  <input
                    type="file"
                    id="AddPost"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setNewPost(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />

                  <label
                    htmlFor="AddPost"
                    title="Add Image"
                    className="cursor-pointer rounded-xl p-2 text-nexus-text-muted transition hover:bg-nexus-surface-hover hover:text-nexus-primary"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleCreatePost();
                  }}
                  disabled={!Caption.trim() || !NewPost || sending}
                  aria-busy={sending}
                  aria-label={sending ? "Creating post" : undefined}
                  className="flex min-w-[72px] items-center justify-center rounded-xl bg-nexus-primary px-5 py-2 text-xs font-semibold tracking-wider text-nexus-text uppercase shadow-md shadow-nexus-primary/20 transition-all hover:bg-nexus-primary-hover active:scale-95 disabled:opacity-40"
                >
                  {sending ? (
                    <ButtonSpinner />
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* --- FEED CARDS --- */}
          {posts.map((post) => (
            <article
              key={post._id}
              onClick={() => {
                window.location.href = `/post/${post._id}`;
              }}
              className="space-y-3 rounded-3xl border border-nexus-border bg-nexus-surface p-5 shadow-sm transition-all duration-200 hover:border-nexus-primary/40"
            >
              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      post.Pfp ||
                      "https://i.pinimg.com/736x/02/59/54/0259543779b1c2db9ba9d62d47e11880.jpg"
                    }
                    alt={post.Username}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="cursor-pointer text-sm font-bold text-nexus-text hover:underline">
                        {post.Username}
                      </h3>
                    </div>

                    <span className="text-xs text-nexus-text-muted">
                      {post.Username} • {formatPostTime(post.UploadedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm leading-relaxed text-nexus-text-secondary">
                {post.Caption}
              </p>

              {/* Optional Image */}
              {post.Url && (
                <div className="overflow-hidden rounded-2xl border border-nexus-border">
                  <img
                    src={post.Url}
                    alt="Post asset"
                    className="h-auto w-full object-contain"
                  />
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between border-t border-nexus-border pt-3 text-xs font-medium text-nexus-text-muted">
                <div className="flex items-center space-x-5">
                  {/* Like */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post._id);
                    }}
                    className={`flex items-center space-x-1.5 font-bold transition ${
                      post.isLiked
                        ? "text-nexus-like"
                        : "text-nexus-text-muted hover:text-nexus-like"
                    }`}
                  >
                    <Heart
                      size={14}
                      fill={post.isLiked ? "currentColor" : "none"}
                    />
                    <span>{post.Likes}</span>
                  </button>

                  {/* Comments */}
                  <button className="flex items-center space-x-1.5 text-nexus-text-muted transition hover:text-nexus-primary">
                    <svg
                      className="h-4 w-4 fill-none stroke-current"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>

                    <span>{post.CommentCount}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </main>

        {/* ================= 3. RIGHT WIDGETS ================= */}
        <aside className="hidden w-72 space-y-5 lg:block">
          <div className="space-y-3 rounded-3xl border border-nexus-border bg-nexus-surface p-4 shadow-sm">
            <h3 className="text-sm font-bold text-nexus-text">Trending Tags</h3>

            <div className="space-y-2">
              {["TailwindCSS", "React2026", "Nextjs", "DarkUI"].map(
                (tag, idx) => (
                  <div
                    key={idx}
                    className="flex cursor-pointer items-center justify-between rounded-xl p-2 text-xs transition hover:bg-nexus-surface-hover"
                  >
                    <span className="font-semibold text-nexus-text-secondary">
                      #{tag}
                    </span>

                    <span className="text-[10px] text-nexus-text-muted">
                      1.2k posts
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </aside>

        <MobileMenu />
      </div>
    </div>
  );
}
