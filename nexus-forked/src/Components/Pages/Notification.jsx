import { useContext, useEffect, useState } from "react";
import DesktopNav from "../Individual/DesktopNav";
import MobileMenu from "../Individual/MobileMenu";
import { ThemeContext } from "../context/context";

export default function NotificationPage({ socket }) {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [notification, setNotification] = useState([]);

  const getNotifications = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/notifications`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      setNotification(data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("sendNotification", getNotifications);
  }, [socket]);

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

  return (
    <div>
      <div className="min-h-screen bg-nexus-bg text-nexus-text transition-colors duration-300">
        {/* APP CONTAINER */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 pb-20 md:pb-6">
          {/* ================= 1. DESKTOP SIDEBAR ================= */}

          <DesktopNav />

          {/* ================= 2. MAIN Notification CONTENT ================= */}

          <main className="flex-1 min-w-0 bg-nexus-surface border border-nexus-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-nexus-text">
                  Notifications
                </h1>

                <p className="text-xs sm:text-sm text-nexus-text-secondary">
                  activities on your account
                </p>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="md:hidden p-2 text-nexus-text-secondary hover:text-nexus-primary"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>

            {/* ================= Notificationss================= */}

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {notification.length > 0 ? (
                notification.map((notify) => (
                  <div
                    key={notify.id}
                    onClick={() =>
                      (window.location.href = `/user/${notify.NotificationBy}`)
                    }
                    className="
                      w-full
                      p-2 sm:p-3
                      bg-nexus-surface-hover
                      border border-nexus-border
                      rounded-xl sm:rounded-2xl
                      flex flex-col
                      gap-3
                      hover:border-nexus-primary/30
                      transition
                      cursor-pointer
                      overflow-hidden
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* User + Notification */}
                      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <img
                          src={
                            notify?.byPfp ||
                            "https://i.pinimg.com/736x/02/59/54/0259543779b1c2db9ba9d62d47e11880.jpg"
                          }
                          alt={notify.NotificationBy}
                          className="
                            w-9 h-9
                            sm:w-11 sm:h-11
                            md:w-12 md:h-12
                            rounded-full
                            object-cover
                            shrink-0
                          "
                        />

                        <div className="min-w-0 flex-1">
                          <h3
                            className="
                              text-sm sm:text-base
                              text-nexus-text
                              leading-snug
                              break-words
                              line-clamp-2
                            "
                          >
                            <span className="font-bold text-nexus-text">
                              {notify.NotificationBy}
                            </span>{" "}
                            {notify.NotificationMessage}
                          </h3>

                          <p className="text-[10px] sm:text-xs text-nexus-text-muted mt-1">
                            {formatPostTime(notify.sentAt)}
                          </p>
                        </div>
                      </div>

                      {/* Action / Post Image */}
                      <div className="shrink-0">
                        {notify?.postUrl ? (
                          <img
                            src={notify.postUrl}
                            alt="Post"
                            className="
                              w-14 h-14
                              sm:w-16 sm:h-16
                              md:w-20 md:h-20
                              rounded-lg sm:rounded-xl
                              object-cover
                            "
                          />
                        ) : (
                          <button></button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  key={0}
                  className="col-span-full text-center py-12 text-nexus-text-muted text-xs"
                >
                  No Notifications yet.
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
