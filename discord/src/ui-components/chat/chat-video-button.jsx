import { Video, VideoOff } from "lucide-react";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ChatVideoButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const params = useParams();
  console.log(pathname);

  const isVideo = searchParams.get("video");
  const Icon = isVideo ? VideoOff : Video;

  const toolTipLabel = isVideo ? "End video call" : "Start video call";

  const onClick = () => {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    if (!isVideo) {
      searchParams.set("video", "true");
    } else {
      searchParams.delete("video");
    }

    currentUrl.search = searchParams.toString();
    navigate(currentUrl.pathname + currentUrl.search);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger>
          {" "}
          <button
            onClick={onClick}
            className="hover:opacity-75 transition mr-4 mt-2"
          >
            <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {toolTipLabel}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChatVideoButton;
