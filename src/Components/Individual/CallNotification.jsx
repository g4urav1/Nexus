import { useContext, useEffect, useState } from "react";
import {
  CallerContext,
  CallStatusContext,
  CurrentCallContext,
  ReceiverContext,
  ThemeContext,
} from "../context/context";
import { useNavigate } from "react-router-dom";

export default function CallNotification() {

  const navigate = useNavigate();

  const { caller, setCaller } = useContext(CallerContext);
  const { receiver } = useContext(ReceiverContext);
  const { callStatus } = useContext(CallStatusContext);
  const { currentCall } = useContext(CurrentCallContext);

  const adminId = localStorage.getItem("adminId");

  const callerId = caller?._id?.toString();

  const isCaller = adminId !== callerId;

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (callStatus !== "OnCall") return;

    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus]);

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  useEffect(() => {
    if (callStatus !== "ended") {
      return;
    }

    const timer = setTimeout(() => {
      setCaller(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [callStatus, setCaller]);

  return (
    <div>
      {callStatus != null && (
        <div className="absolute z-50 w-full">
          {caller && (
            <div
              onClick={() => {
                navigate(`/call/${currentCall.conversationId}`);
              }}
              className="
                md:w-1/5 w-full rounded-full mt-3 mx-auto
                bg-nexus-primary
                text-white
                shadow-[0_10px_30px_rgba(99,102,241,0.35)]
                border border-nexus-border
                transition-all duration-300
              "
            >
              <main>
                <div className="w-full">
                  <div className="w-full flex items-center justify-center gap-3 py-3">
                    <div className="text-center flex items-center gap-2">
                      <p className="font-semibold">
                        {isCaller ? caller.Username : receiver.Username}
                      </p>

                      <span>•</span>

                      {callStatus === "incoming" && (
                        <p className="text-sm text-white/80">Incoming Call</p>
                      )}

                      {callStatus === "calling" && (
                        <p className="text-sm text-white/80">Calling...</p>
                      )}

                      {callStatus === "OnCall" && (
                        <p className="text-sm text-white/80">
                          {String(hours).padStart(2, "0")}:
                          {String(minutes).padStart(2, "0")}:
                          {String(seconds).padStart(2, "0")}
                        </p>
                      )}

                      {callStatus === "ended" && (
                        <p className="text-sm text-white">Ended</p>
                      )}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
