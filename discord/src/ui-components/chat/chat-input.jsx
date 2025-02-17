import axios from "axios";
import { useForm } from "react-hook-form";
import { Plus, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import useSocket from "../../hooks/useSocketHook";
import { useRef, useState } from "react";
import url from "../../api/url";
import EmojiPicker from "../emoji-picker";
import production from "../../base";

export const ChatInput = ({ apiUrl, query, name, type }) => {
  const { onOpen, getData } = useModal();
  const [loading, setLoading] = useState(false);
  const { connected, messages, sendMessage } = useSocket(`${production}`);
  const [input, setInput] = useState("");
  const inputRef = useRef();

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior (like form submission)
      handleSendMessage();
      submit(input);
    }
  };

  const submit = async (value) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        serverId: query.serverId,
        channelId: query.channelId,
        conversationId: query.conversationId,
      }).toString();

      const endpoint = `${apiUrl}?${queryParams}`;

      const res = await url.post(endpoint, { content: value });
      // console.log(res, "response");
      getData("getMessage", { data: res?.data?.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="">
      <div className="relative p-4 pb-6">
        <button
          onClick={(e) => {
            e.preventDefault();
            onOpen("messageFile", { apiUrl, query });
          }}
          className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
        >
          <Plus className="text-white dark:text-[#313338]" />
        </button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
          placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
          ref={inputRef}
        />
        <div className="absolute top-7 right-8">
          <EmojiPicker
            onChange={(emoji) => {
              const inputElement = inputRef.current;
              const start = inputElement.selectionStart;
              const end = inputElement.selectionEnd;
              const newInput =
                input.substring(0, start) + `${emoji} ` + input.substring(end);
              setInput(newInput);
              setTimeout(() => {
                inputElement.selectionStart = inputElement.selectionEnd =
                  start + emoji.length + 1;
                inputElement.focus();
              }, 0);
            }}
          />
        </div>
      </div>
    </form>
  );
};
