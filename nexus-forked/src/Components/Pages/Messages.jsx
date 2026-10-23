import { useContext, useEffect, useRef, useState } from "react";

import DesktopNav from "../Individual/DesktopNav";

import MobileMenu from "../Individual/MobileMenu";

import { useNavigate, useParams } from "react-router-dom";

import {
  CallerContext,
  PeerContext,
  ReceiverContext,
  ThemeContext,
} from "../context/context";

export default function MessagesPage({ socket }) {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const adminId = localStorage.getItem("adminId");

  const { conversationId } = useParams();

  const navigate = useNavigate();

  const bottomRef = useRef(null);

  const messageContainerRef = useRef(null);

  const [activeChatId, setActiveChatId] = useState(conversationId || "");

  const [mobileShowChat, setMobileShowChat] = useState(false);

  const [messageInput, setMessageInput] = useState("");

  const [messages, setMessages] = useState([]);

  const [loadingMessages, setLoadingMessages] = useState(false);

  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);

  const [loadingConversation, setLoadingConversation] = useState(false);

  const [conversations, setConversations] = useState([]);

  const [messageSkip, setMessageSkip] = useState(0);

  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const { setCaller } = useContext(CallerContext);

  const { setReceiver } = useContext(ReceiverContext);

  const { peerId } = useContext(PeerContext);

  const activeChat = conversations.find(
    (chat) => chat.conversationId === activeChatId,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeChat]);

  const Call = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/call/${conversationId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        console.error("Failed to get call details");
        return;
      }

      const data = await response.json();

      if (data.callerDetails) {
        setCaller(data.callerDetails);
      }

      if (data.receiverDetails) {
        setReceiver(data.receiverDetails);
      }
    } catch (error) {
      console.error("Failed to get call details:", error);
    }

    SendPeer();
  };

  const SendPeer = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/call/${conversationId}/sendPeer`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            peer: peerId,
          }),
        },
      );

      if (!response.ok) {
        console.error("Failed to send peer details");
        return;
      }
    } catch (error) {
      console.error("Failed to send peer details:", error);
    }
  };

  useEffect(() => {
    setActiveChatId(conversationId || "");

    if (conversationId) {
      setMobileShowChat(true);
    } else {
      setMobileShowChat(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;

    const fetchMessages = (data) => {
      const newMessage = data.message;

      setMessages((prev) => {
        if (prev.some((message) => message._id === newMessage._id)) {
          return prev;
        }

        return [...prev, newMessage];
      });
    };

    socket.on("RefreshMsg", fetchMessages);

    return () => {
      socket.off("RefreshMsg", fetchMessages);
    };
  }, [socket, adminId]);

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
          return;
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

  const getMessages = async (skip = 0, loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMoreMessages(true);
      } else {
        setLoadingMessages(true);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/messages/${activeChatId}?skip=${skip}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        console.error("Failed to get messages");
        return;
      }

      const data = await response.json();

      if (loadMore) {
        setMessages((prev) => [...data, ...prev]);
      } else {
        setMessages(Array.isArray(data) ? data : []);
      }

      setHasMoreMessages(data.length === 10);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
      setLoadingMoreMessages(false);
    }
  };

  const loadMoreMessages = async () => {
    if (loadingMoreMessages || !hasMoreMessages) return;

    const container = messageContainerRef.current;

    // Before loading
    const previousScrollHeight = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    const newSkip = messageSkip + 10;

    await getMessages(newSkip, true);

    setMessageSkip(newSkip);

    // After new messages are rendered
    requestAnimationFrame(() => {
      const newScrollHeight = container.scrollHeight;

      container.scrollTop =
        previousScrollTop + (newScrollHeight - previousScrollHeight);
    });
  };

  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);

      return;
    }

    setMessageSkip(0);

    setHasMoreMessages(true);

    getMessages(0, false);
  }, [activeChatId]);

  const handleSelectChat = (conversationId) => {
    setActiveChatId(conversationId);

    setMobileShowChat(true);

    navigate(`/inbox/${conversationId}`);
  };

  const formatMessageTime = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);

    const now = new Date();

    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours >= 24) {
      return messageDate.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChatName = (chat) => {
    if (!chat?.participants?.length) {
      return "Unknown Conversation";
    }

    return chat.participants
      .map((user) => user.Username || "Unknown User")
      .join(", ");
  };

  const getParticipants = (chat) => {
    return chat?.participants || [];
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const content = messageInput.trim();

    if (!content || !activeChatId) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/sendMessages/${activeChatId}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
          }),
        },
      );

      if (!response.ok) {
        console.error("Failed to send message");
        return;
      }

      setMessageInput("");

      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-nexus-bg text-nexus-text transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 h-screen">
          <DesktopNav />

          <main className="flex-1 bg-nexus-surface border border-nexus-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm flex h-[calc(100vh-5rem)] md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">
            <div
              className={`w-full md:w-72 lg:w-80 border-r border-nexus-border flex flex-col shrink-0 ${
                mobileShowChat ? "hidden md:flex" : "flex"
              }`}
            >
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
                            ? "bg-nexus-primary/10 shadow-[inset_2px_0_6px_-1px_var(--nexus-primary)]"
                            : "hover:bg-nexus-surface-hover"
                        }`}
                      >
                        <div className="flex -space-x-3 shrink-0">
                          {participants.slice(0, 3).map((user, index) => (
                            <img
                              key={`${user.Username}-${index}`}
                              src={
                                user.pfp ||
                                "https://i.pinimg.com/736x/02/59/54/0259543779b1c2db9ba9d62d47e11880.jpg"
                              }
                              alt={user.Username || "User"}
                              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-nexus-surface"
                            />
                          ))}

                          {participants.length > 3 && (
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-nexus-surface-hover border-2 border-nexus-surface flex items-center justify-center text-[10px] font-semibold text-nexus-text-secondary">
                              +{participants.length - 3}
                            </div>
                          )}
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

            {activeChat && (
              <div
                className={`flex-1 flex-col h-full bg-nexus-surface/50 ${
                  mobileShowChat ? "flex" : "hidden md:flex"
                }`}
              >
                <div className="p-3 sm:p-4 bg-nexus-surface border-b border-nexus-border flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <button
                      onClick={() => {
                        setMobileShowChat(false);
                        navigate("/inbox");
                        setMessages([]);
                      }}
                      className="md:hidden p-1.5 text-nexus-text-secondary hover:text-nexus-text rounded-xl transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                    </button>

                    <div className="flex -space-x-2 shrink-0">
                      {activeChat.participants
                        ?.slice(0, 3)
                        .map((user, index) => (
                          <img
                            key={`${user.Username}-${index}`}
                            src={
                              user.pfp ||
                              "https://i.pinimg.com/736x/02/59/54/0259543779b1c2db9ba9d62d47e11880.jpg"
                            }
                            alt={user.Username || "User"}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-nexus-surface"
                          />
                        ))}

                      {activeChat.participants?.length > 3 && (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-nexus-surface-hover border-2 border-nexus-surface flex items-center justify-center text-[9px] font-semibold text-nexus-text-secondary">
                          +{activeChat.participants.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-nexus-text leading-tight truncate">
                        {getChatName(activeChat)}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`call ${getChatName(activeChat)}`)) {
                        Call();
                        navigate(`/call/${conversationId}`);
                      }
                    }}
                    className="p-2 text-nexus-text-muted hover:bg-nexus-surface-hover rounded-xl transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.828-1.015-5.116-3.303-6.131-6.131l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  ref={messageContainerRef}
                  className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3"
                >
                  {hasMoreMessages &&
                    !loadingMessages &&
                    messages.length > 0 && (
                      <div className="flex justify-center py-1">
                        <button
                          onClick={loadMoreMessages}
                          disabled={loadingMoreMessages}
                          className="text-xs text-nexus-primary hover:text-nexus-primary-hover disabled:opacity-50 font-medium px-3 py-1.5 rounded-lg hover:bg-nexus-primary/10 transition"
                        >
                          {loadingMoreMessages ? "Loading..." : "Load more"}
                        </button>
                      </div>
                    )}

                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-xs text-nexus-text-muted">
                        Loading messages...
                      </p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-xs text-nexus-text-muted">
                        No messages yet
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.user_id == adminId;

                      return (
                        <div
                          key={msg._id}
                          className={`flex flex-col ${
                            isMe ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] sm:max-w-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? "bg-nexus-primary text-nexus-text rounded-br-none shadow-md shadow-nexus-primary/10"
                                : "bg-nexus-surface text-nexus-text rounded-bl-none border border-nexus-border shadow-sm"
                            }`}
                          >
                            {msg.content}
                          </div>

                          <span className="text-[10px] text-nexus-text-muted mt-1 px-1">
                            {formatMessageTime(msg.created_at)}
                          </span>
                        </div>
                      );
                    })
                  )}

                  <div ref={bottomRef}></div>
                </div>

                <div className="p-2.5 sm:p-3 bg-nexus-surface border-t border-nexus-border mb-12 md:mb-2">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-nexus-surface-hover border-none rounded-2xl px-3.5 py-2 text-xs text-nexus-text placeholder-nexus-text-muted focus:outline-none focus:ring-2 focus:ring-nexus-primary/30"
                    />

                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="p-2 sm:p-2.5 bg-nexus-primary hover:bg-nexus-primary-hover disabled:opacity-40 text-nexus-text rounded-xl transition shadow-md shadow-nexus-primary/20 active:scale-95"
                    >
                      <svg
                        className="w-4 h-4 fill-none stroke-current"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12L3 21l18-9L3 3l3 9zm0 0h7"
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>

          <MobileMenu />
        </div>
      </div>
    </div>
  );
}
