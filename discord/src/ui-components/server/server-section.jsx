import { Plus, Settings } from "lucide-react";
import { useModal } from "../../hooks/use-modal-store";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      {label !== "Agent Channel" &&
        role !== "GUEST" &&
        sectionType === "channels" && (
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger>
                <span
                  onClick={() => onOpen("createChannel", { server })}
                  className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                >
                  <Plus className="h-4 w-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p className="font-semibold text-sm capitalize">{label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      {role === "ADMIN" && sectionType === "members" && (
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger>
              <span
                // onClick={() => onOpen("members", { server })}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              >
                {role === "ADMIN" && (
                  <Settings
                    className="h-4 w-4"
                    onClick={() => onOpen("members", { server })}
                  />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="font-semibold text-sm capitalize">{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
