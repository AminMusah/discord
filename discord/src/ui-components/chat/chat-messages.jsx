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

// import { useChatQuery } from "@/hooks/use-chat-query";
// import { useChatScroll } from "@/hooks/use-chat-scroll";

import { ChatWelcome } from "./chat-welcome";
import url from "../../api/url";
import { useParams } from "react-router-dom";
import { useModal } from "../../hooks/use-modal-store";
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
  const bottomRef = useRef;

  const { isOpen } = useModal();

  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [messages, setMessages] = useState([]);
  const params = useParams();

  const { channelId, id } = params;

  const [loadingMore, setLoadingMore] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  // All messages
  const getMessages = async () => {
    try {
      // setStatus({ loading: true });
      const queryParams = new URLSearchParams({
        serverId: socketQuery?.serverId,
        channelId: socketQuery?.channelId,
        page: currentPage,
      }).toString();

      const endpoint = `/messages?${queryParams}`;
      const response = await url.get(endpoint);
      // Append new messages to the existing ones, filtering out duplicates
      setMessages((prevMessages) => {
        const existingIds = new Set(prevMessages.map((message) => message._id)); // Create a set of existing message IDs
        const newMessages = response.data.filter(
          (message) => !existingIds.has(message._id)
        ); // Filter out duplicates
        return [...prevMessages, ...newMessages]; // Append new unique messages
      });

      // Determine if there are more messages to load based on the response
      setHasNextPage(response.data.length > 0); // Set hasNextPage based on response
    } catch (error) {
      console.log(error);
      setStatus({
        error: "error",
      });
    } finally {
      setStatus({ loading: false });
      setLoadingMore(false);
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
  }, [currentPage, channelId, isOpen]);

  useEffect(() => {
    const chatElement = chatRef.current;
    if (chatElement && messages.length > 0 && !initialScrollDone) {
      chatElement.scrollTop = chatElement.scrollHeight;
      setInitialScrollDone(true);
    }
  }, [messages]);

  useEffect(() => {
    getMessages();
  }, []);

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
      {!hasNextPage && <ChatWelcome type={type} name={name} />}

      {loadingMore ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <Loader2 className="h-5 w-5 text-zinc-500 animate-spin my-4" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Loading more messages...
          </p>
        </div>
      ) : null}

      <div className="flex flex-col-reverse mt-auto">
        {messages?.map((message, i) => (
          <Fragment key={i}>
            {/* {group.items.map((message) => ( */}
            <ChatItem
              key={message._id}
              id={message._id}
              currentMember={member?.[0]}
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
            {/* ))} */}
          </Fragment>
        ))}
      </div>
      {/* <div ref={bottomRef} /> */}
    </div>
  );
};
