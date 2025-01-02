import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import image from "../../assets/guillermo-diaz-fs6zYhHyzvI-unsplash.jpg";

const ServerItem = ({ id, imageUrl, name }) => {
  const params = useParams();
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/server/${id}`);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger>
          <span onClick={onClick} className="group relative flex items-center">
            <div
              className={cn(
                "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                params?.id !== id && "group-hover:h-[20px]",
                params?.id === id ? "h-[36px]" : "h-[8px]"
              )}
            />
            <div
              className={cn(
                "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                params?.id === id && "bg-primary/10 text-primary rounded-[16px]"
              )}
            >
              <img
                src={imageUrl || image}
                alt="Channel"
                className="object-cover w-full"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
              />
            </div>
          </span>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          <p className="font-semibold text-sm capitalize">{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ServerItem;
