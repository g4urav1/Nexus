import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Volume2,
  VolumeOff,
} from "lucide-react";

import { useContext, useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  AdminContext,
  CallerContext,
  CallStatusContext,
  PeerContext,
  ReceiverContext,
} from "../context/context";

export default function CallPage({ socket }) {
  const adminId = localStorage.getItem("adminId");

  const { admin } = useContext(AdminContext);

  const { conversationId } = useParams();

  const { callStatus, setCallStatus } = useContext(CallStatusContext);

  const { caller, setCaller, localStream, setLocalStream, remoteStream } =
    useContext(CallerContext);

  const { receiver, setReceiver } = useContext(ReceiverContext);

  const { peerId } = useContext(PeerContext);

  const [duration, setDuration] = useState(0);

  const [micOn, setMicOn] = useState(true);

  const [camOn, setCamOn] = useState(true);

  const [OnSpeaker, setOnSpeaker] = useState(false);

  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const wasReloaded = sessionStorage.getItem(`callEnded_${conversationId}`);

    if (wasReloaded === "true") {
      sessionStorage.removeItem(`callEnded_${conversationId}`);
      setCallStatus("ended");
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem(`callEnded_${conversationId}`, "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [conversationId, setCallStatus]);

  useEffect(() => {
    if (callStatus !== "ended") {
      return;
    }

    const timer = setTimeout(() => {
      navigate(-1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [callStatus, navigate]);

  useEffect(() => {
    const getCallDetail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/call/${conversationId}`,
          {
            method: "GET",
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
    };

    if (conversationId) {
      getCallDetail();
    }
  }, [conversationId, setCaller, setReceiver]);

  const getCallUser = () => {
    if (!adminId) {
      return null;
    }

    if (!caller || !receiver) {
      return null;
    }

    const callerId = caller?._id?.toString();

    const receiverId = receiver?._id?.toString();

    const currentUserId = adminId?.toString();

    if (callerId === currentUserId) {
      return receiver;
    }

    if (receiverId === currentUserId) {
      return caller;
    }

    return null;
  };

  useEffect(() => {
    if (callStatus !== "OnCall") {
      return;
    }

    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus]);

  const hours = Math.floor(duration / 3600);

  const minutes = Math.floor((duration % 3600) / 60);

  const seconds = duration % 60;

  const callUser = getCallUser();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(mediaStream);

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.log(error);
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    if (!stream || !videoRef.current) return;

    videoRef.current.srcObject = stream;

    videoRef.current.play().catch(() => {});
  }, [stream, callStatus, camOn]);

  useEffect(() => {
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.enabled = camOn;
    }
  }, [stream, camOn]);

  const updateCallStatus = async (status) => {
    try {
      await fetch(
        `${import.meta.env.VITE_BASE_URL}/call/${conversationId}/status`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleUpdateStatus = (data) => {
      setCallStatus(data.status);
    };

    socket.on("updateStatus", handleUpdateStatus);

    return () => {
      socket.off("updateStatus", handleUpdateStatus);
    };
  }, [socket, setCallStatus, callStatus]);

  const sendPeer = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_BASE_URL}/call/${conversationId}/sendPeer`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ peer: peerId }),
        },
      );
    } catch (error) {
      console.error("Failed to send peer:", error);
    }
  };

  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (callStatus !== "OnCall" || !remoteStream) {
      return;
    }

    remoteVideoRef.current.srcObject = remoteStream;

    remoteVideoRef.current.play().catch(() => {});
  }, [remoteStream, callStatus, callUser]);

  return (
    <div>
      <div className="min-h-[100dvh] w-full bg-nexus-bg text-nexus-text transition-colors duration-300">
        <div className="flex min-h-[100dvh] w-full items-center justify-center p-2 sm:p-4 lg:p-6">
          <main className="relative isolate flex h-[calc(100dvh-1rem)] w-full max-w-7xl overflow-hidden rounded-2xl border border-nexus-border bg-nexus-surface shadow-sm sm:h-[calc(100dvh-2rem)] sm:rounded-3xl lg:h-[calc(100dvh-3rem)]">
            {callUser?.Pfp && (
              <>
                <div
                  className="absolute inset-0 z-0 scale-110 bg-cover bg-center blur-3xl"
                  style={{
                    backgroundImage: `url(${callUser.Pfp})`,
                  }}
                />

                <div className="absolute inset-0 z-0 bg-nexus-bg/80" />
              </>
            )}

            <div className="relative z-10 h-full w-full">
              {/* CALLING */}
              {callStatus === "calling" && (
                <div className="relative flex h-full w-full flex-col">
                  {/* User information */}
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pb-32 text-center">
                    {callUser && (
                      <>
                        <img
                          src={callUser.Pfp || ""}
                          alt={callUser.Username || "User"}
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-nexus-primary/30 shadow-2xl sm:h-28 sm:w-28 md:h-32 md:w-32"
                        />

                        <div>
                          <h2 className="text-lg font-semibold text-nexus-text sm:text-xl">
                            {callUser.Username || "Unknown User"}
                          </h2>

                          <p className="mt-1 text-sm text-nexus-text-secondary">
                            Calling...
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Local camera preview */}
                  <div className="absolute right-4 top-4 z-30 h-32 w-24 overflow-hidden rounded-2xl border border-nexus-border bg-nexus-surface shadow-2xl sm:h-40 sm:w-32 md:h-48 md:w-36">
                    {camOn ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="h-full w-full object-cover scale-x-[-1]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-nexus-surface">
                        <img
                          src={admin?.Pfp || ""}
                          alt={admin?.Username || "User"}
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-nexus-primary/30 shadow-2xl sm:h-24 sm:w-24 md:h-30 md:w-30"
                        />
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center bg-nexus-bg/80 px-4 pb-6 pt-20 sm:pb-8">
                    <div className="flex items-center gap-3 rounded-full border border-nexus-border bg-nexus-surface/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:gap-4 sm:px-6">
                      <button
                        onClick={() => setMicOn((prev) => !prev)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition sm:h-14 sm:w-14 ${
                          micOn
                            ? "bg-nexus-surface-hover text-nexus-text hover:bg-nexus-primary/20"
                            : "bg-nexus-error text-nexus-text hover:bg-nexus-error"
                        }`}
                      >
                        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                      </button>

                      <button
                        onClick={() => setCamOn((prev) => !prev)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition sm:h-14 sm:w-14 ${
                          camOn
                            ? "bg-nexus-surface-hover text-nexus-text hover:bg-nexus-primary/20"
                            : "bg-nexus-error text-nexus-text hover:bg-nexus-error"
                        }`}
                      >
                        {camOn ? <Video size={20} /> : <VideoOff size={20} />}
                      </button>

                      <button
                        onClick={() => setOnSpeaker((prev) => !prev)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition sm:h-14 sm:w-14 ${
                          OnSpeaker
                            ? "bg-nexus-primary text-nexus-text hover:bg-nexus-primary-hover"
                            : "bg-nexus-surface-hover text-nexus-text hover:bg-nexus-primary/20"
                        }`}
                      >
                        {OnSpeaker ? (
                          <Volume2 size={20} />
                        ) : (
                          <VolumeOff size={20} />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          updateCallStatus("ended");
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-nexus-error text-nexus-text transition hover:bg-nexus-error sm:h-14 sm:w-14"
                      >
                        <PhoneOff size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* INCOMING */}
              {callStatus === "incoming" && (
                <div className="relative flex h-full w-full flex-col">
                  {/* Local camera preview */}
                  <div className="absolute right-4 top-4 z-30 h-32 w-24 overflow-hidden rounded-2xl border border-nexus-border bg-nexus-surface shadow-2xl sm:h-40 sm:w-32 md:h-48 md:w-36">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="h-full w-full object-cover scale-x-[-1]"
                    />
                  </div>

                  {/* Caller information */}
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pb-32 text-center">
                    {callUser && (
                      <>
                        <img
                          src={callUser.Pfp || ""}
                          alt={callUser.Username || "User"}
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-nexus-primary/30 shadow-2xl sm:h-28 sm:w-28 md:h-32 md:w-32"
                        />

                        <div>
                          <h2 className="text-lg font-semibold text-nexus-text sm:text-xl">
                            {callUser.Username || "Unknown User"}
                          </h2>

                          <p className="mt-1 text-sm text-nexus-text-secondary">
                            Incoming call...
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Incoming controls */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center bg-nexus-bg/80 px-4 pb-6 pt-20 sm:pb-8">
                    <div className="flex items-center gap-12 rounded-full border border-nexus-border bg-nexus-surface/90 px-5 py-3 shadow-2xl backdrop-blur-xl sm:gap-16 sm:px-7">
                      <button
                        onClick={() => {
                          updateCallStatus("ended");
                        }}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-nexus-error text-nexus-text shadow-lg transition hover:bg-nexus-error hover:scale-105 active:scale-95 sm:h-16 sm:w-16"
                      >
                        <PhoneOff size={21} />
                      </button>

                      <button
                        onClick={() => {
                          sendPeer();
                          updateCallStatus("OnCall");
                        }}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-nexus-success text-nexus-text shadow-lg transition hover:bg-nexus-success hover:scale-105 active:scale-95 sm:h-16 sm:w-16"
                      >
                        <Phone size={21} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ON CALL */}
              {callStatus === "OnCall" && (
                <div className="relative h-full w-full">
                  {/* Other user's profile / video */}
                  {callUser && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-4 pb-28 text-center">
                      {remoteStream ? (
                        <video
                          ref={remoteVideoRef}
                          autoPlay
                          playsInline
                          className="max-h-full w-full object-contain -scale-x-[1]"
                        ></video>
                      ) : (
                        <img
                          src={callUser.Pfp || ""}
                          alt={callUser.Username || "User"}
                          className="h-28 w-28 rounded-full object-cover ring-4 ring-nexus-primary/30 shadow-2xl sm:h-32 sm:w-32 md:h-36 md:w-36"
                        />
                      )}

                      <div>
                        <h2 className="text-lg font-semibold text-nexus-text sm:text-xl">
                          {callUser.Username || "Unknown User"}
                        </h2>

                        <div className="mt-1 text-sm text-nexus-text-secondary">
                          <p>
                            {String(hours).padStart(2, "0")}:
                            {String(minutes).padStart(2, "0")}:
                            {String(seconds).padStart(2, "0")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Own camera */}
                  <div className="absolute bottom-24 left-4 z-30 h-36 w-28 overflow-hidden rounded-2xl border border-nexus-border bg-nexus-surface shadow-2xl sm:h-44 sm:w-32 md:h-48 md:w-36">
                    {camOn ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="h-full w-full object-cover scale-x-[-1]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-nexus-surface">
                        <img
                          src={admin?.Pfp || ""}
                          alt={admin?.Username || "User"}
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-nexus-primary/30 shadow-2xl sm:h-24 sm:w-24 md:h-30 md:w-30"
                        />
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center bg-nexus-bg/80 px-4 pb-6 pt-20 sm:pb-8">
                    <div className="flex items-center gap-3 rounded-full border border-nexus-border bg-nexus-surface/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:gap-4 sm:px-6">
                      <button
                        onClick={() => setMicOn((prev) => !prev)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition sm:h-14 sm:w-14 ${
                          micOn
                            ? "bg-nexus-surface-hover text-nexus-text hover:bg-nexus-primary/20"
                            : "bg-nexus-error text-nexus-text hover:bg-nexus-error"
                        }`}
                      >
                        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                      </button>

                      <button
                        onClick={() => setCamOn((prev) => !prev)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition sm:h-14 sm:w-14 ${
                          camOn
                            ? "bg-nexus-surface-hover text-nexus-text hover:bg-nexus-primary/20"
                            : "bg-nexus-error text-nexus-text hover:bg-nexus-error"
                        }`}
                      >
                        {camOn ? <Video size={20} /> : <VideoOff size={20} />}
                      </button>

                      <button
                        onClick={() => setOnSpeaker((prev) => !prev)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition sm:h-14 sm:w-14 ${
                          OnSpeaker
                            ? "bg-nexus-primary text-nexus-text hover:bg-nexus-primary-hover"
                            : "bg-nexus-surface-hover text-nexus-text hover:bg-nexus-primary/20"
                        }`}
                      >
                        {OnSpeaker ? (
                          <Volume2 size={20} />
                        ) : (
                          <VolumeOff size={20} />
                        )}
                      </button>

                      <button
                        onClick={() => updateCallStatus("ended")}
                        className="flex h-12 w-14 items-center justify-center rounded-full bg-nexus-error text-nexus-text transition hover:bg-nexus-error active:scale-95 sm:h-14 sm:w-16"
                      >
                        <PhoneOff size={21} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ENDED */}
              {callStatus === "ended" && (
                <div className="absolute inset-0 bg-nexus-bg/80">
                  {callUser && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-4 text-center">
                      <img
                        src={callUser.Pfp || ""}
                        alt={callUser.Username || "User"}
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-nexus-border sm:h-28 sm:w-28 md:h-32 md:w-32"
                      />

                      <div>
                        <h2 className="text-lg font-semibold text-nexus-text sm:text-xl">
                          {callUser.Username || "Unknown User"}
                        </h2>

                        <p className="mt-1 text-sm text-nexus-text-muted">
                          Call ended
                        </p>

                        <div className="mt-1 text-sm text-nexus-text">
                          <p>
                            {hours === 0 && minutes === 0 && seconds === 0
                              ? "No Answer"
                              : `${String(hours).padStart(2, "0")}:${String(
                                  minutes,
                                ).padStart(2, "0")}:${String(seconds).padStart(
                                  2,
                                  "0",
                                )}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
