import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useNavigate, useParams } from "react-router-dom";
import { UserAvatar } from "../user-avatar";
import url from "../../api/url";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
  role,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [edit, setEdit] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { onOpen, isOpen } = useModal();
  const params = useParams();
  const navigate = useNavigate();

  const onMemberClick = () => {
    if (member?._id === currentMember?._id) {
      return;
    }

    navigate(`/server/${params?.id}/conversation/${member?._id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keyDown", handleKeyDown);
  }, []);

  const onSubmit = async (value) => {
    try {
      setSubmitting(true);

      const queryParams = new URLSearchParams({
        url: `${socketUrl}/${id}`,
        channelId: socketQuery?.channelId,
        serverId: socketQuery?.serverId,
        messageId: id,
      }).toString();

      const endpoint = `/messages?${queryParams}`;
      const response = await url.patch(endpoint, { content: value });
      console.log(response, "d");
      setNewContent(response.data.content);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setEdit(newContent !== "" ? newContent : content);
  }, []);

  const fileType = fileUrl?.split(".").pop().split("?")[0];

  const isAdmin = currentMember?.role === "ADMIN";
  const isModerator = currentMember?.role === "MODERATOR";
  const isOwner = currentMember?._id === member?._id;
  const canDeleteMessage = deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member?.profile?.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibold text-sm hover:underline cursor-pointer"
              >
                {member?.profile?.name}
              </p>

              <TooltipProvider>
                <Tooltip delayDuration={50}>
                  <TooltipTrigger>{roleIconMap[member?.role]}</TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="font-semibold text-sm capitalize">
                      {member?.role}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <img src={fileUrl} alt={content} className="object-cover" />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(edit);
                }}
              >
                <div className="flex-1">
                  <div className="relative w-full">
                    <Input
                      value={edit}
                      onChange={(e) => setEdit(e.target.value)}
                      disabled={submitting}
                      className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      placeholder="Edited message"
                    />
                  </div>
                </div>

                <Button disabled={submitting} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger>
                  {" "}
                  <Edit
                    onClick={() => setIsEditing(!isEditing)}
                    className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                  />
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  Edit
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger>
                {" "}
                <Trash
                  onClick={() =>
                    onOpen("deleteMessage", {
                      apiUrl: `${socketUrl}/${id}`,
                      query: socketQuery,
                      messageId: id,
                    })
                  }
                  className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                Delete
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};
