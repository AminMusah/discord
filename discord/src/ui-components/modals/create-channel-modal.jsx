// import qs from "query-string";
import axios from "axios";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { useEffect } from "react";

export const CreateChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "createChannel";
  const { channelType } = data;

  // useEffect(() => {
  //   if (channelType) {
  //     form.setValue("type", channelType);
  //   } else {
  //     form.setValue("type", ChannelType.TEXT);
  //   }
  // }, [channelType, form]);

  // const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
      // const url = qs.stringifyUrl({
      //   url: "/api/channels",
      //   query: {
      //     serverId: params?.serverId,
      //   },
      // });
      await axios.post(url, values);

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Channel
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <Button variant="primary">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
