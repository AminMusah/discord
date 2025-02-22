import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Smile } from "lucide-react";

const EmojiPicker = ({ onChange }) => {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Smile className="text-zinc-500  hover:text-zinc-600 dark:text-zinc-300 transition" />
        </PopoverTrigger>
        <PopoverContent
          side="right"
          sideOffset={40}
          className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji) => onChange(emoji.native)}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default EmojiPicker;
