import axios from "axios";
import { Check, Copy, LogOutIcon, RefreshCw } from "lucide-react";
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

export const ProfileModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "profile";
  const navigation = useNavigate();

  const userId = localStorage.getItem("user");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile(userId));
  }, [dispatch, isOpen]);

  const profile = useSelector((state) => state.profile.profile);

  const LogOut = () => {
    onClose();
    localStorage.clear();
    navigation("/");
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            My Account
          </DialogTitle>
        </DialogHeader>
        <div className=" text-center">{profile?.name}</div>
        <div className="p-6">
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
