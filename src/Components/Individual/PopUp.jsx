import { useContext } from "react";
import { PopUpContext, PopUpMsgContext } from "../context/context";

export default function Popup() {
  const { ShowPopUp } = useContext(PopUpContext);
  const { popUpMsg } = useContext(PopUpMsgContext);

  return (
    <>
      {ShowPopUp && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-nexus-surface fixed z-50 text-nexus-primary bottom-10 left-1/2 -translate-x-1/2 p-6 rounded-xl shadow-xl min-w-[300px] flex flex-col items-center"
        >
          <p className="text-center">{popUpMsg}</p>
        </div>
      )}
    </>
  );
}
