import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModal } from "../../hooks/use-modal-store";

const ServerAction = () => {
  const { onOpen } = useModal();
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger>
          <span
            onClick={() => onOpen("createServer")}
            className="group flex items-center"
          >
            <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
              <Plus
                className="group-hover:text-white transition text-emerald-500"
                size={25}
              />
            </div>
          </span>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          <p className="font-semibold text-sm capitalize">Add Server</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ServerAction;
