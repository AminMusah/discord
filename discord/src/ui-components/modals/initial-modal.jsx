import axios from "axios";
import { useForm } from "react-hook-form";
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
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import url from "../../api/url";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/apiCalls";
import ImageUpload from "../ImageUpload";
// import { FileUpload } from "@/components/file-upload";

export const InitialModal = () => {
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (name, imgUrl) => {
    try {
      setLoading(true);

      const server = await url.post(`/server/createserver/`, {
        name: name,
        imageUrl: imgUrl,
      });
      console.log(server);
      navigate(`/server/${server.data.data._id}`);
      toast.success(server.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
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

  return (
    <Dialog open>
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
        <ImageUpload endpoint="serverImage" setFile={setFile} file={file} />
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
