import { Hash } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import useSocket from "../../hooks/useSocketHook";

// import { MobileToggle } from "@/components/mobile-toggle";
// import { SocketIndicator } from "@/components/socket-indicator";

// import { ChatVideoButton } from "./chat-video-button";

export const ChatHeader = ({ serverId, name, type, imageUrl }) => {
  const { connected, messages, sendMessage } = useSocket(
    "http://localhost:6060"
  );

  const SocketIndicator = ({ status }) => {
    return (
      <div className="flex items-center">
        <div
          className={`socket-indicator mr-1 ${
            status === "Connected" ? "bg-green-500" : "bg-red-500"
          } w-3 h-3 rounded-full`}
        />
        <span className="text-xs">{status}</span>
      </div>
    );
  };

  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      {/* <MobileToggle serverId={serverId} /> */}
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {/* {type === "conversation" && <ChatVideoButton />} */}
        {/* <SocketIndicator /> */}

        {connected ? (
          <SocketIndicator status="Connected" />
        ) : (
          <SocketIndicator status="Disconnected" />
        )}
      </div>
    </div>
  );
};
