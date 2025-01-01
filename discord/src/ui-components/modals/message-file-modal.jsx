import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import url from "../../api/url";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/apiCalls";
import ImageUpload from "../ImageUpload";
import { useModal } from "@/hooks/use-modal-store";

export const MessageFileModal = () => {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();
  const { isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;

  const isModalOpen = isOpen && type === "messageFile";

  const onSubmit = async (value) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        url: apiUrl || "",
        serverId: query.serverId,
        channelId: query.channelId,
        conversationId: query.conversationId,
      }).toString();

      const endpoint = `${apiUrl}?${queryParams}`;

      await url.post(endpoint, { ...value, content: value, fileUrl: value });
      setFile("");
      toast.success("success");
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const userId = localStorage.getItem("user");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile(userId));
  }, [dispatch]);

  const profile = useSelector((state) => state.profile.profile);

  useEffect(() => {
    if (!profile) {
      navigate("/");
    }
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <Toaster position="top-center" richColors />
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment{" "}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message.
          </DialogDescription>
        </DialogHeader>
        <ImageUpload endpoint="messageFile" setFile={setFile} file={file} />
        <div className="mt-8 space-y-8 px-6">
          <form
            action=""
            className="group"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(file);
            }}
          >
            <DialogFooter className=" py-4">
              <Button disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  ""
                )}
                Send
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
