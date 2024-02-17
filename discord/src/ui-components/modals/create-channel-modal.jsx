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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import url from "../../api/url";

export const CreateChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [channelInput, setChannelInput] = useState("");

  const isModalOpen = isOpen && type === "createChannel";
  const { channelType, server } = data;
  const { register, handleSubmit, watch, formState, setValue } = useForm();

  const typeOfChannel = {
    text: "TEXT",
    audio: "AUDIO",
    video: "VIDEO",
  };

  const validateType = (value) => {
    if (value === "general") {
      return "Channel name cannot be 'general";
    }
    return undefined; // No error
  };

  const handChannelTypeChange = (value) => {
    setChannelInput(value);
  };

  useEffect(() => {
    if (channelInput !== undefined) {
      setValue("type", channelInput);
    } else {
      setValue("type", typeOfChannel.text);
    }
  }, [channelInput]);

  const isLoading = formState.isSubmitting;

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const queryParams = new URLSearchParams({
        serverId: server?._id,
      }).toString();

      const endpoint = `/channel?${queryParams}`;

      const response = await url.post(endpoint, data);
      if (!response.data) {
        throw new Error("Failed to creat channel");
      }

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

        <div className="mt-8 space-y-8 px-6">
          <form action="" className="group" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="mb-2 block text-sm text-gray-600">
                Channel Name
              </label>
              <input
                {...register("name", {
                  required: "Channel name is required",
                  validate: validateType,
                })}
                id="name"
                placeholder="Enter Server Name"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-300 shadow shadow-gray-100 focus:border-gray-500 focus:outline-none valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
              />
              <div className="flex flex-col mt-2">
                {formState.errors.name && (
                  <span className="text-xs text-red-400">
                    {formState.errors.name.message}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm text-gray-600">
                Channel type
              </label>
              <Select
                {...register("type", { required: "Channel type is required" })}
                onValueChange={(value) => {
                  handChannelTypeChange(value);
                }}
              >
                <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                  <SelectValue placeholder="Select a channel type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(typeOfChannel).map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className=" py-4">
              <Button disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  ""
                )}
                Create
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
