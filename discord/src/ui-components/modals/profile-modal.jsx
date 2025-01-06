import axios from "axios";
import { Check, Copy, LogOutIcon, RefreshCw, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../redux/apiCalls";
import ImageUpload from "../ImageUpload";
import url from "../../api/url";
import { toast } from "sonner";

export const ProfileModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const isModalOpen = isOpen && type === "profile";
  const navigation = useNavigate();

  const userId = localStorage.getItem("user");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile(userId));
    setFile(profile?.imageUrl);
  }, [dispatch, isOpen]);

  const profile = useSelector((state) => state.profile.profile);

  const LogOut = () => {
    onClose();
    localStorage.clear();
    navigation("/");
  };

  const submit = async (value) => {
    try {
      setLoading(true);

      const endpoint = `/profile`;

      const res = await url.patch(endpoint, { imageUrl: value });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error, "e");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Profile
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full px-4">
          <div className="flex justify-between w-full">
            <ImageUpload
              endpoint="profileImage"
              setFile={setFile}
              file={file}
              submit={submit}
            />
            {loading && (
              <span className="text-xs">Uploading... please wait :)</span>
            )}
            <div className="flex items-center px-4 py-1 h-8 rounded-full bg-gray-100 transition-all duration-300">
              <span className="mr-1 tex-xs">👋 </span>
              <span className="text-xs"> {profile?.name}</span>
            </div>
          </div>
          <div className="flex w-full flex-wrap mt-4">
            {profile?.servers &&
              profile?.servers.map((server) => (
                <span className="px-6  mx-1 py-2 rounded-full bg-gray-100 transition-all duration-300">
                  {server?.name}
                </span>
              ))}
          </div>
        </div>
        <div className="pb-6 px-4 flex justify-end items-end">
          <Button
            onClick={LogOut}
            size="sm"
            className="text-xs text-white mt-4"
          >
            LogOut
            <LogOutIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
