import {
  Fragment,
  useRef,
  ElementRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { ChatItem } from "./chat-item";
import { io } from "socket.io-client";

// import { useChatQuery } from "@/hooks/use-chat-query";
// import { useChatScroll } from "@/hooks/use-chat-scroll";

import { ChatWelcome } from "./chat-welcome";
import url from "../../api/url";
import { useParams } from "react-router-dom";
import { useModal } from "../../hooks/use-modal-store";
import useSocket from "../../hooks/useSocketHook";
// import { useChatSocket } from "@/hooks/use-chat-socket";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
  role,
}) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  const { isOpen } = useModal();

  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [msgs, setMsgs] = useState([]);
  const params = useParams();

  const { channelId, id } = params;

  const [loadingMore, setLoadingMore] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const { connected, messages, sendMessage } = useSocket(
    "http://localhost:6060"
  );
  const socketRef = useRef(null);

  // All messages
  const getMessages = async () => {
    try {
      if (currentPage === 1) {
        setStatus({ loading: true });
      } else {
        setLoadingMore(true);
      }
      const queryParams = new URLSearchParams({
        serverId: socketQuery?.serverId,
        channelId: socketQuery?.channelId,
        conversationId: chatId,
        page: currentPage,
      }).toString();

      const endpoint = `${apiUrl}?${queryParams}`;

      const response = await url.get(endpoint);
      setMsgs((prevMessages) => {
        const existingIds = new Set(prevMessages.map((message) => message._id));
        const newMessages = response.data.filter(
          (message) => !existingIds.has(message._id)
        );
        return [...prevMessages, ...newMessages];
      });

      setHasNextPage(response.data.length > 0);
    } catch (error) {
      console.log(error);
      setStatus({
        error: "error",
      });
    } finally {
      if (currentPage === 1) {
        setStatus({ loading: false });
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadMoreMessages = () => {
    if (hasNextPage) {
      setLoadingMore(true);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleScroll = useCallback(() => {
    if (chatRef.current) {
      const { scrollTop } = chatRef.current;
      if (scrollTop === 0) {
        loadMoreMessages();
      }
    }
  }, [hasNextPage]);

  useEffect(() => {
    const chatElement = chatRef.current;
    if (chatElement) {
      chatElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (chatElement) {
        chatElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    getMessages();
  }, [currentPage, channelId, isOpen, chatId]);

  useEffect(() => {
    const chatElement = chatRef.current;
    if (chatElement && msgs.length > 0 && !initialScrollDone) {
      chatElement.scrollTop = chatElement.scrollHeight;
      setInitialScrollDone(true);
    }
  }, [msgs]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs]);

  useEffect(() => {
    // Initialize the socket connection
    socketRef.current = io("http://localhost:6060"); // Replace with your server URL

    // Listen for the event from the backend
    socketRef.current.on(
      `chat:${channelId}:messages` ||
        `chat:${channelId}:updatedmessages` ||
        `chat:${chatId}:messages` ||
        `chat:${chatId}:updatedmessages`,
      (newMessage) => {
        setMsgs((prevMessages) => [newMessage, ...prevMessages]);
        console.log("New message received:", newMessage);
      }
    );

    // Cleanup when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.off(`chat:${channelId}:messages`);
        socketRef.current.disconnect();
      }
    };
  }, [channelId, messages]);

  console.log(msgs);

  if (status.loading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status.error === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {hasNextPage && <ChatWelcome type={type} name={name} />}

      {loadingMore ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <Loader2 className="h-5 w-5 text-zinc-500 animate-spin my-4" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Loading more messages...
          </p>
        </div>
      ) : null}

      <div className="flex flex-col-reverse mt-auto">
        {msgs?.map((message, i) => (
          <Fragment key={i}>
            <ChatItem
              key={message._id}
              id={message._id}
              currentMember={member}
              member={message.memberId}
              content={message?.content}
              fileUrl={message?.fileUrl}
              deleted={message?.deleted}
              timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
              isUpdated={message.updatedAt !== message.createdAt}
              socketUrl={socketUrl}
              socketQuery={socketQuery}
              role={role}
            />
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
