import React, { useEffect, useState } from "react";
import { ChatHeader } from "../ui-components/chat/chat-header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChannel } from "../redux/apiCalls";
import { ChatInput } from "../ui-components/chat/chat-input";
import { ChatMessages } from "../ui-components/chat/chat-messages";

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

  console.log(membersInServer); // This will log the members from the profile that are in the server

  const role = server?.members?.find(
    (member) => member?.profile?._id === userId
  )?.role;

  console.log(role);

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
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: serverChannel._id,
              serverId: server._id,
            }}
            paramKey="channelId"
            paramValue={serverChannel?.id}
            role={role}
          />
          <ChatInput
            name={serverChannel.name}
            type="channel"
            apiUrl="/socket/messages"
            query={{
              channelId: serverChannel._id,
              serverId: server._id,
            }}
          />
        </>
      )}
      {/* {channel.type === ChannelType.AUDIO && (
    <MediaRoom chatId={channel.id} video={false} audio={true} />
  )} */}
      {/* {channel.type === ChannelType.VIDEO && (
    <MediaRoom chatId={channel.id} video={true} audio={true} />
  )} */}
    </div>
  );
};

export default Channel;
