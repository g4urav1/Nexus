import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Popup from "../Individual/PopUp";
import CallNotification from "../Individual/CallNotification";
import callSound from "../../assets/instagram_caller_tune.mp3";

import {
  CallerContext,
  CallStatusContext,
  CurrentCallContext,
  PopUpContext,
  PopUpMsgContext,
  ReceiverContext,
} from "../context/context";

export default function Parent({ socket }) {
  const adminId = localStorage.getItem("adminId");
  const location = useLocation();

  const navigate = useNavigate();

  const { setShowPopUp } = useContext(PopUpContext);
  const { setPopUpMsg } = useContext(PopUpMsgContext);

  const { setCaller } = useContext(CallerContext);
  const { setReceiver } = useContext(ReceiverContext);

  const { callStatus, setCallStatus } = useContext(CallStatusContext);
  const { setCurrentCall } = useContext(CurrentCallContext);

  useEffect(() => {
    if (callStatus == "rejected") {
      navigate(-1);
      setCaller(null);
    }
  }, [callStatus]);

  // useEffect(() => {
  //   const audio = new Audio(callSound);

  //   if (callStatus === "calling" || callStatus === "incoming") {
  //     audio.loop = true;

  //     audio.play().catch((err) => {
  //       console.log("Call audio blocked:", err);
  //     });
  //   }

  //   return () => {
  //     audio.pause();
  //     audio.currentTime = 0;
  //   };
  // }, [callStatus]);

  useEffect(() => {
    if (!socket || !adminId) return;

    const GetCall = (data) => {
      setCurrentCall(data);

      const { caller, receiver } = data;

      setCaller(data.caller);
      setReceiver(data.receiver);

      if (caller?._id?.toString() === adminId?.toString()) {
        setCallStatus("calling");
      } else if (receiver?._id?.toString() === adminId?.toString()) {
        setCallStatus("incoming");
      }
    };

    socket.on("GetCall", GetCall);

    return () => {
      socket.off("GetCall", GetCall);
    };
  }, [socket, adminId, setCaller, setReceiver, setCallStatus, setCurrentCall]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      const newMessage = data.message;
      const Username = data.Username;

      if (newMessage.user_id === adminId) return;

      setPopUpMsg(`You have a new message from ${Username}`);
      setShowPopUp(true);

      setTimeout(() => {
        setShowPopUp(false);
      }, 5000);
    };

    socket.on("RefreshMsg", handleNewMessage);

    return () => {
      socket.off("RefreshMsg", handleNewMessage);
    };
  }, [socket, adminId, setPopUpMsg, setShowPopUp]);

  const isCallPage = location.pathname.startsWith("/call");

  return (
    <>
      {!isCallPage && <CallNotification socket={socket} />}
      <Popup />
      <Outlet />
    </>
  );
}
