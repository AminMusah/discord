import React, { useEffect, useState } from "react";
import { ChatHeader } from "../ui-components/chat/chat-header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChannel } from "../redux/apiCalls";
import { ChatInput } from "../ui-components/chat/chat-input";
import { ChatMessages } from "../ui-components/chat/chat-messages";
import MediaRoom from "../ui-components/media-room";

const Channel = ({ server, profile }) => {
  const [channels, setChannels] = useState("");
  const userId = localStorage.getItem("user");

  const params = useParams();

  const { channelId, id } = params;

  const serverChannel = server?.channels?.find(
    (channel) => channel?._id === channelId
  );

  // Check if profile members are in the server
  const profileMemberIds = profile.members?.map((member) => member?._id);
  const serverMemberIds = server.members?.map((member) => member?._id);

  const membersInServer = profile.members?.filter((member) =>
    serverMemberIds?.includes(member?._id)
  );

  const role = server?.members?.find(
    (member) => member?.profile?._id === userId
  )?.role;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen ">
      <ChatHeader
        name={serverChannel?.name}
        serverId={server?._id}
        type="channel"
      />
      {serverChannel?.type === "TEXT" && (
        <>
          <ChatMessages
            // member={member}
            member={membersInServer}
            name={serverChannel?.name}
            chatId={serverChannel?.id}
            type="channel"
            apiUrl="/messages"
            socketUrl="/"
            socketQuery={{
              channelId: serverChannel?._id,
              serverId: server?._id,
            }}
            paramKey="channelId"
            paramValue={serverChannel?._id}
            role={role}
          />
          <ChatInput
            name={serverChannel?.name}
            type="channel"
            apiUrl="/socket/messages"
            query={{
              channelId: serverChannel?._id,
              serverId: server?._id,
            }}
          />
        </>
      )}
      {serverChannel?.type === "AUDIO" && (
        <MediaRoom chatId={channelId} video={false} audio={true} />
      )}
      {serverChannel?.type === "VIDEO" && (
        <MediaRoom chatId={channelId} video={true} audio={true} />
      )}
    </div>
  );
};

export default Channel;
