import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import url from "../../api/url";
import EmojiPicker from "../emoji-picker";
import { useModal } from "../../hooks/use-modal-store";

const ChatRoom = ({ apiUrl, query }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const inputRef = useRef();
  const { onOpen } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await url.post(`/agent/tools`, { userInput: input });

      const aiResponse = res.data;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: err.response.data.error },
      ]);
    } finally {
      setLoading(false);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  return (
    <main className={cn("bg-white dark:bg-[#313338] flex flex-col h-screen ")}>
      <div className="flex-1 overflow-y-auto px-6 pt-6">
        {messages.length === 0 ? (
          <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
            <h1 className="text-2xl font-semibold">AI Chatbot</h1>
            <p className="text-muted-foreground text-sm">
              Ask me to create servers, channels, or manage your Cord app.
            </p>
          </header>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                data-role={message.role}
                className="max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
              >
                {message.role === "user" ? "You: " : "AI: "}
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="self-start rounded-xl bg-gray-100 px-3 py-2 text-sm text-black">
                AI is thinking...
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </div>
      <form className="">
        <div className="relative p-4 pb-6">
          <button
            onClick={(e) => {
              e.preventDefault();
              onOpen("messageFile", {
                apiUrl,
                query,
              });
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
            placeholder={`Message ${"#" + "Agent"}`}
            ref={inputRef}
          />
          <div className="absolute top-7 right-8">
            <EmojiPicker
              onChange={(emoji) => {
                const inputElement = inputRef.current;
                const start = inputElement.selectionStart;
                const end = inputElement.selectionEnd;
                const newInput =
                  input.substring(0, start) +
                  `${emoji} ` +
                  input.substring(end);
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
    </main>
  );
};

export default ChatRoom;
