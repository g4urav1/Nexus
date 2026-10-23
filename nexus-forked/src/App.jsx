
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPages from "./Components/Pages/Auth";
import FeedPage from "./Components/Pages/Home";
import MessagesPage from "./Components/Pages/Messages";
import InboxPage from "./Components/Pages/Inbox";
import ProfilePage from "./Components/Pages/Profile";
import SearchPage from "./Components/Pages/Search";
import LoginPage from "./Components/Pages/Login";
import ForgetPasswordPage from "./Components/Pages/ForgetPassword";
import ResetPasswordPage from "./Components/Pages/ResetPassword";
import SignupPage from "./Components/Pages/Signup";
import EditPage from "./Components/Pages/Edit";
import CreatePostPage from "./Components/Pages/CreatePost";
import Post from "./Components/Pages/Post";
import { useEffect, useMemo, useState } from "react";
import { Peer } from "peerjs";

import {
  AdminContext,
  UserPostContext,
  PopUpContext,
  PopUpMsgContext,
  CallStatusContext,
  CallerContext,
  ReceiverContext,
  CurrentCallContext,
  PeerContext,
  ThemeContext,
} from "./Components/context/context";

import NotificationPage from "./Components/Pages/Notification";
import FollowersPage from "./Components/Pages/Followers";
import FollowingPage from "./Components/Pages/Following";
import { io } from "socket.io-client";
import Parent from "./Components/Pages/Parent";
import CallPage from "./Components/Pages/Call";

export default function App() {
  const [admin, setAdmin] = useState("");
  const [UserPosts, setUserPosts] = useState([]);
  const [ShowPopUp, setShowPopUp] = useState(false);
  const [popUpMsg, setPopUpMsg] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const [peer, setPeer] = useState(null);

  const adminId = localStorage.getItem("adminId");

  const [caller, setCaller] = useState();
  const [receiver, setReceiver] = useState();
  const [currentCall, setCurrentCall] = useState();
  const [socket, setSocket] = useState(null);

  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [remoteStream, setRemoteStream] = useState(null);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_BASE_URL, {
      withCredentials: true,
    });

    setSocket(socketConnection);

    socketConnection.on("randomRouteHit", (data) => console.log(data));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("Stream updated: ", localStream);
  }, [localStream]);

  useEffect(() => {
    const newPeer = new Peer();

    setPeer(newPeer);

    newPeer.on("open", async (id) => {
      console.log("Peer id: ", id);
      setPeerId(id);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/connect/peer`,
          {
            body: JSON.stringify({ peerId: id }),
            method: "POST",
            headers: { "content-type": "application/json" },
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        console.log("Peer connected!");
      } catch (error) {
        console.log(error);
      }
    });

    return () => {
      newPeer.destroy();
    };
  }, []);

  useEffect(() => {
    if (!peer) return;

    const handleOutGoingCall = (call) => {
      console.log("OutGoing call: ", localStream);
      call.answer(localStream);

      call.on("stream", (incomingRemoteStream) => {
        console.log("Receiving remote stream: ", incomingRemoteStream);
        setRemoteStream(incomingRemoteStream);
      });
    };

    peer.on("call", handleOutGoingCall);

    return () => {
      peer.off("call", handleOutGoingCall);
    };
  }, [peer, localStream]);

  useEffect(() => {
    if (!socket) return;

    const handleSendPeer = (data) => {
      if (String(adminId) === String(data.senderId)) return;

      console.log("Received remote peer:", data.peer);
      console.log("Making call", localStream, data.peer);

      if (localStream && peer) {
        const call = peer.call(data.peer, localStream);

        call.on("stream", (incomingRemoteStream) => {
          console.log("remote stream received!");
          setRemoteStream(incomingRemoteStream);
        });
      }

      setRemotePeerId(data.peer);
    };

    socket.on("sendPeer", handleSendPeer);

    return () => socket.off("sendPeer", handleSendPeer);
  }, [socket, adminId, localStream, peer]);

  useEffect(() => {
    if (callStatus !== "ended") return;

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    setLocalStream(null);
    setRemoteStream(null);
  }, [callStatus]);

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/",
          element: <Parent socket={socket} />,
          children: [
            { path: "/", element: <FeedPage socket={socket} /> },
            { path: "/auth", element: <AuthPages /> },
            { path: "/inbox", element: <InboxPage /> },
            {
              path: "/inbox/:conversationId",
              element: <MessagesPage socket={socket} />,
            },
            {
              path: "/call/:conversationId",
              element: <CallPage socket={socket} />,
            },
            { path: "/User/:Username", element: <ProfilePage /> },
            { path: "/search", element: <SearchPage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/forget-password", element: <ForgetPasswordPage /> },
            { path: "/reset-password", element: <ResetPasswordPage /> },
            { path: "/signup", element: <SignupPage /> },
            {
              path: "/notification",
              element: <NotificationPage socket={socket} />,
            },
            { path: "/edit/profile", element: <EditPage /> },
            { path: "/create/post", element: <CreatePostPage /> },
            { path: "/post/:id", element: <Post socket={socket} /> },
            { path: "/Followers/:Username", element: <FollowersPage /> },
            { path: "/Following/:Username", element: <FollowingPage /> },
          ],
        },
      ]),
    [socket],
  );

  const loadUser = async () => {
    const publicPaths = [
      "/login",
      "/forget-password",
      "/signup",
      "/reset-password",
    ];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        setAdmin("");
        setUserPosts([]);

        if (!publicPaths.includes(window.location.pathname)) {
          window.location.replace("/login");
        }

        return;
      }

      const data = await response.json();

      if (!data.admin) {
        setAdmin("");
        setUserPosts([]);

        if (!publicPaths.includes(window.location.pathname)) {
          window.location.replace("/login");
        }

        return;
      }

      setAdmin(data.admin);
      setUserPosts(data.UserPosts ?? []);
    } catch (error) {
      console.error("Failed to load user:", error);

      setAdmin("");
      setUserPosts([]);

      if (!publicPaths.includes(window.location.pathname)) {
        window.location.replace("/login");
      }
    }
  };

  useEffect(() => {
    const publicPaths = [
      "/login",
      "/forget-password",
      "/signup",
      "/reset-password",
    ];

    if (!publicPaths.includes(window.location.pathname)) {
      loadUser();
    }
  }, []);

  return (
    <PeerContext.Provider value={{ peerId, setPeerId, remotePeerId, setRemotePeerId }}>
      <CurrentCallContext.Provider value={{ currentCall, setCurrentCall }}>
        <ReceiverContext.Provider value={{ receiver, setReceiver }}>
          <CallerContext.Provider
            value={{
              caller,
              setCaller,
              localStream,
              setLocalStream,
              remoteStream,
            }}
          >
            <CallStatusContext.Provider value={{ callStatus, setCallStatus }}>
              <PopUpMsgContext.Provider value={{ popUpMsg, setPopUpMsg }}>
                <PopUpContext.Provider value={{ ShowPopUp, setShowPopUp }}>
                  <UserPostContext.Provider value={{ UserPosts, setUserPosts }}>
                    <AdminContext.Provider value={{ admin, setAdmin }}>
                      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
                        <RouterProvider router={router} />
                      </ThemeContext.Provider>
                    </AdminContext.Provider>
                  </UserPostContext.Provider>
                </PopUpContext.Provider>
              </PopUpMsgContext.Provider>
            </CallStatusContext.Provider>
          </CallerContext.Provider>
        </ReceiverContext.Provider>
      </CurrentCallContext.Provider>
    </PeerContext.Provider>
  );
}
