import axios from "axios";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { FileUpload } from "@/components/file-upload";
import { Loader2 } from "lucide-react";
import { redirect, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useModal } from "../../hooks/use-modal-store";
import url from "../../api/url";
import ImageUpload from "../ImageUpload";
import { useState } from "react";

const CreateServerModal = () => {
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState("");

  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "createServer";

  const navigate = useNavigate();

  const onSubmit = async (name, imgUrl) => {
    try {
      setLoading(true);

      const server = await url.post(`/server/createserver/`, {
        name: name,
        imageUrl: imgUrl,
      });
      redirect(`/server/${server.data.data._id}`);
      onClose();
      toast.success(server.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <Toaster position="top-center" richColors />
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <ImageUpload setFile={setFile} />
        <div className="mt-8 space-y-8 px-6">
          <form
            action=""
            className="group"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(name, file);
            }}
          >
            <div className="mb-6">
              <label className="mb-2 block text-sm text-gray-600">
                Server Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                id="name"
                placeholder="Enter Server Name"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-300 shadow shadow-gray-100 focus:border-gray-500 focus:outline-none valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                required
              />
              {/* <span className="mt-2 hidden text-sm text-red-400">
               Server name is required.
              </span> */}
            </div>
            <DialogFooter className=" py-4">
              <Button disabled={loading} className="w-full">
                {loading ? (
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

export default CreateServerModal;
