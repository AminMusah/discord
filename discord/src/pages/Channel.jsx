import React from "react";
import { ChatHeader } from "../ui-components/chat/chat-header";

const Channel = () => {
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader name="hello" serverId="hello" type="channel" />
      {/* {channel.type === ChannelType.TEXT && ( */}
      <>
        {/* <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        paramKey="channelId"
        paramValue={channel.id}
      /> */}
        {/* <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      /> */}
      </>
      {/* )} */}
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
