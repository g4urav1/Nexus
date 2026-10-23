import { useContext, useEffect, useState } from "react";
import DesktopNav from "../Individual/DesktopNav";
import MobileMenu from "../Individual/MobileMenu";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/context";

export default function InboxPage() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [activeChatId, setActiveChatId] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const [loadingConversation, setLoadingConversation] = useState(false);

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        setLoadingConversation(true);

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/conversations`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          console.error("Failed to get conversations");
        }

        const data = await response.json();

        setConversations(data);
      } catch (error) {
        console.error(error);
        setConversations([]);
      } finally {
        setLoadingConversation(false);
      }
    };

    getConversation();
  }, []);

  const navigate = useNavigate();

  const handleSelectChat = (conversationId) => {
    setActiveChatId(conversationId);
    setMobileShowChat(true);
    navigate(`/inbox/${conversationId}`);
  };

  const getChatName = (chat) => {
    return chat.participants
      .map((user) => user.Username || "Unknown User")
      .join(", ");
  };

  const getParticipants = (chat) => {
    return chat?.participants || [];
  };

  return (
    <div>
      <div className="min-h-screen bg-nexus-bg text-nexus-text transition-colors duration-300">
        {/* APP CONTAINER */}

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 h-screen">
          {/* ================= 1. DESKTOP SIDEBAR / NAVIGATION ================= */}

          <DesktopNav />

          {/* ================= 2. MESSAGES CONTAINER ================= */}

          <main className="flex-1 bg-nexus-surface border border-nexus-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm flex h-[calc(100vh-5rem)] md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">
            {/* ================= LEFT: CONVERSATIONS ================= */}

            <div
              className={`w-full md:w-72 lg:w-80 border-r border-nexus-border flex flex-col shrink-0 ${
                mobileShowChat ? "hidden md:flex" : "flex"
              }`}
            >
              {/* ================= HEADER ================= */}

              <div className="p-3.5 sm:p-4 space-y-3 border-b border-nexus-border">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-base sm:text-lg text-nexus-text">
                    Messages
                  </h2>

                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="md:hidden p-2 text-nexus-text-secondary hover:text-nexus-primary"
                  >
                    {darkMode ? "☀️" : "🌙"}
                  </button>
                </div>

                {/* ================= SEARCH ================= */}

                <div className="relative">
                  <svg
                    className="w-4 h-4 absolute left-3 top-3 text-nexus-text-muted"
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
                    placeholder="Search chats..."
                    className="w-full pl-9 pr-4 py-2 bg-nexus-surface-hover border-none rounded-xl text-xs text-nexus-text placeholder-nexus-text-muted focus:outline-none focus:ring-2 focus:ring-nexus-primary/30"
                  />
                </div>
              </div>

              {/* ================= CONTACTS ================= */}

              <div className="flex-1 overflow-y-auto divide-y divide-nexus-border/50">
                {loadingConversation ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-xs text-nexus-text-muted">
                      Loading conversations...
                    </p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-xs text-nexus-text-muted">
                      No conversations
                    </p>
                  </div>
                ) : (
                  conversations.map((chat) => {
                    const isActive = chat.conversationId === activeChatId;
                    const participants = getParticipants(chat);

                    return (
                      <div
                        key={chat.conversationId}
                        onClick={() => handleSelectChat(chat.conversationId)}
                        className={`flex items-center space-x-3 p-3.5 cursor-pointer transition ${
                          isActive
                            ? "bg-nexus-primary/10 shadow-[4px_0_6px_-2px_var(--nexus-primary)]"
                            : "hover:bg-nexus-surface-hover"
                        }`}
                      >
                        {/* avatars */}

                        <div className="flex -space-x-3 shrink-0">
                          {participants.slice(0, 3).map((user, index) => (
                            <img
                              key={`${user.Username}-${index}`}
                              src={
                                user.pfp ||
                                "https://i.pinimg.com/736x/02/59/54/0259543779b1c2db9ba9d62d47e11880.jpg"
                              }
                              alt={user.Username || "User"}
                              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover"
                            />
                          ))}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-nexus-text truncate">
                            {getChatName(chat)}
                          </h4>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="hidden md:flex flex-1 items-center justify-center">
              <p className="text-sm text-nexus-text-muted">
                Select a conversation
              </p>
            </div>
          </main>

          {/* ================= 3. MOBILE BOTTOM NAVIGATION ================= */}

          <MobileMenu />
        </div>
      </div>
    </div>
  );
}
