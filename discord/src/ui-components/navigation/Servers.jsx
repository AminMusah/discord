import { cn } from "@/lib/utils";
import image from "../../assets/guillermo-diaz-fs6zYhHyzvI-unsplash.jpg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUsers } from "../../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";

export const ServerItem = ({ id, imageUrl, name }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClick = () => {
    navigate(`/server/${id}`);
  };

  // dispatch(fetchUsers());

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
              <img src={imageUrl || image} alt="Channel" />
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
