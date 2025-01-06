import { Edit, Hash, HashIcon, Lock, Mic, Trash, Video } from "lucide-react";

import { cn } from "@/lib/utils";
import { useParams, redirect, useNavigate } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModal } from "../../hooks/use-modal-store";
import { useEffect } from "react";

export const ServerChannel = ({ channel, role, server }) => {
  const { onOpen, isOpen } = useModal();
  const params = useParams();
  const navigate = useNavigate();

  const IconMap = {
    TEXT: (
      <Hash className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
    ),
    AUDIO: (
      <Mic className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
    ),
    VIDEO: (
      <Video className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
    ),
  };

  const onClick = () => {
    // Check if both server and channel are available before navigating
    if (server && channel && server?._id && channel?._id) {
      navigate(`/server/${server?._id}/channel/${channel?._id}`);
    }
  };

  const onAction = (e, action) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel?._id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      {IconMap[channel?.type]}
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel?._id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel?.name}
      </p>
      {channel?.name !== "general" && role !== "GUEST" && (
        <div className="ml-auto flex items-center gap-x-2">
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger>
                <Edit
                  onClick={(e) => onAction(e, "editChannel")}
                  className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                />
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p className="font-semibold text-sm capitalize">Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger>
                <Trash
                  onClick={(e) => onAction(e, "deleteChannel")}
                  className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                />
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p className="font-semibold text-sm capitalize">Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      {channel?.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};
