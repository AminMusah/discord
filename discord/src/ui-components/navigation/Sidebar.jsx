import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../hooks/use-modal-store";
import { getMemberServers } from "../../redux/apiCalls";
import ServerAction from "./ServerAction";
import ServerItem from "./ServerItem";

const Sidebar = ({ profile }) => {
  const { isOpen } = useModal();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMemberServers());
  }, [dispatch, isOpen]);

  const servers = useSelector((state) => state.servers.servers);

  useEffect(() => {
    if (!profile) {
      navigate("/");
    }
  }, []);

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <ScrollArea className="flex-1 w-full">
        {servers?.map((server) => (
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
