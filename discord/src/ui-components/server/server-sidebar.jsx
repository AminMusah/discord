import { Mic, Settings } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import image from "../../assets/guillermo-diaz-fs6zYhHyzvI-unsplash.jpg";
import { useModal } from "../../hooks/use-modal-store";
import { UserAvatar } from "../user-avatar";
import { ServerChannel } from "./server-channel";
import ServerHeader from "./server-header";
import { ServerMember } from "./server-member";
import { ServerSection } from "./server-section";

const typeOfChannel = {
  text: "TEXT",
  agent: "AGENT",
  audio: "AUDIO",
  video: "VIDEO",
};

const ServerSidebar = ({ server, profile }) => {
  const { onOpen, isOpen } = useModal();
  const userId = localStorage.getItem("user");

  const textChannels = server?.channels?.filter(
    (channel) => channel?.type === "TEXT"
  );

  const agentChannels = server?.channels?.filter(
    (channel) => channel?.type === "AGENT"
  );

  const audioChannels = server?.channels?.filter(
    (channel) => channel?.type === "AUDIO"
  );

  const videoChannels = server?.channels?.filter(
    (channel) => channel?.type === "VIDEO"
  );

  const member = server?.members?.filter(
    (member) => member?.profile?._id !== userId
  );

  const role = server?.members?.find(
    (member) => member?.profile?._id === userId
  )?.role;

  // console.log(textChannels, "textChannels");

  return (
    <div
      className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]"
      // style={{
      //   backgroundImage: `url(${server?.imageUrl || ""})`,
      //   backgroundSize: "cover",
      // }}
    >
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType={typeOfChannel}
            role={role}
            label="Text Channels"
            server={server}
          />
          <div className="space-y-[2px]">
            {textChannels?.map((channel) => (
              <ServerChannel
                key={channel?._id}
                channel={channel}
                role={role}
                server={server}
                fisrtChannel={textChannels}
              />
            ))}
          </div>
        </div>
        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType={typeOfChannel}
            role={role}
            label="Agent Channel"
            server={server}
          />
          <div className="space-y-[2px]">
            {agentChannels?.map((channel) => (
              <ServerChannel
                key={channel?._id}
                channel={channel}
                role={role}
                server={server}
                fisrtChannel={textChannels}
              />
            ))}
          </div>
        </div>

        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType={typeOfChannel}
            role={role}
            label="Voice Channels"
            server={server}
          />
          <div className="space-y-[2px]">
            {audioChannels?.map((channel) => (
              <ServerChannel
                key={channel._id}
                channel={channel}
                role={role}
                server={server}
                fisrtChannel={textChannels}
              />
            ))}
          </div>
        </div>

        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType={typeOfChannel}
            role={role}
            label="Video Channels"
            server={server}
          />
          <div className="space-y-[2px]">
            {videoChannels?.map((channel) => (
              <ServerChannel
                key={channel?._id}
                channel={channel}
                role={role}
                server={server}
                fisrtChannel={textChannels}
              />
            ))}
          </div>
        </div>

        <div className="mb-2">
          <ServerSection
            sectionType="members"
            role={role}
            label="Members"
            server={server}
          />
          <div className="space-y-[2px]">
            {member?.map((member) => (
              <ServerMember key={member._id} member={member} server={server} />
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="flex justify-between items-center w-full absolute bottom-2 mx-2">
        <div className="flex">
          <UserAvatar
            src={profile?.imageUrl || image}
            className="h-8 w-8 md:h-[30px] md:w-[30px] "
          />
          <p className="text-sm mx-2">{profile?.name}</p>
        </div>
        <div className="mr-4 flex">
          <Mic className="h-4 w-4 mr-2" />
          <Settings
            className="h-4 w-4 mr-2 cursor-pointer"
            onClick={() => onOpen("profile")}
          />
        </div>
      </div>
    </div>
  );
};

export default ServerSidebar;
