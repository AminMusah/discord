import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import url from "../../api/url";

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const navigation = useNavigate();

  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query, messageId } = data;

  const [isLoading, setIsLoading] = useState(false);

  console.log(data);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        url: apiUrl,
        channelId: query?.channelId,
        serverId: query?.serverId,
        messageId,
      }).toString();

      const endpoint = `/messages?${queryParams}`;
      const response = await url.delete(endpoint, { content: "delete" });
      console.log(response, "d");

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              className="bg-rose-500"
              onClick={onClick}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
