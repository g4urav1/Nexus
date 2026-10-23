import { createContext } from "react";

export const AdminContext = createContext({
  admin: "",
  setAdmin: () => {},
});
export const UserPostContext = createContext({
  UserPosts: "",
  setUserPosts: () => [],
});

export const PopUpContext = createContext({
  ShowPopUp: false,
  setShowPopUp: () => [],
});
export const PopUpMsgContext = createContext({
  popUpMsg: "",
  setPopUpMsg: () => [],
});

export const CallStatusContext = createContext({
  callStatus: "",
  setCallStatus: () => [],
});

export const CallerContext = createContext({
  caller: "",
  setCaller: () => [],
});

export const ReceiverContext = createContext({
  receiver: "",
  setReceiver: () => [],
});

export const CurrentCallContext = createContext({
  currentCall: "",
  setCurrentCall: () => [],
});

export const PeerContext = createContext();

export const ThemeContext = createContext();
