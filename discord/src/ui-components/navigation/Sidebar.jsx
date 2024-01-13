import axios from "axios";
import React, { useEffect, useState } from "react";
import { ServerItem } from "./servers";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerAction from "./ServerAction";
import { UserAvatar } from "../user-avatar";
import image from "../../assets/guillermo-diaz-fs6zYhHyzvI-unsplash.jpg";
import url from "../../api/url";
import { useModal } from "../../hooks/use-modal-store";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/apiCalls";

const Sidebar = () => {
  const [servers, setServers] = useState([]);
  const { isOpen, onClose } = useModal();

  useEffect(() => {
    const getServer = async () => {
      const userId = localStorage.getItem("user");
      try {
        const server = await url.get(`/profile/${userId}`);
        setServers(server.data.servers);
      } catch (error) {
        console.log(error);
      }
    };
    getServer();
  }, [isOpen, onClose]);

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server?._id} className="mb-4">
            <ServerItem
              id={server?._id}
              name={server?.name}
              imageUrl={server?.imageUrl}
            />
          </div>
        ))}
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto mb-4" />
        <ServerAction />
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        {/* <ModeToggle />*/}
      </div>
    </div>
  );
};

export default Sidebar;
