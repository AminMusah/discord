import React, { useEffect, useState } from "react";
import { ChatHeader } from "../ui-components/chat/chat-header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChannel } from "../redux/apiCalls";
import { ChatInput } from "../ui-components/chat/chat-input";
import { ChatMessages } from "../ui-components/chat/chat-messages";

const Channel = ({ server, profile }) => {
  const [channels, setChannels] = useState("");

  const params = useParams();

  const { channelId, id } = params;

  const serverChannel = server?.channels?.find(
    (channel) => channel?._id === channelId
  );

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
      <ChatHeader
        name={serverChannel?.name}
        // serverId={servers?._id}
        type="channel"
      />
      {serverChannel?.type === "TEXT" && (
        <>
          <ChatMessages
            // member={member}
            name={serverChannel?.name}
            chatId={serverChannel?.id}
            type="channel"
            // apiUrl="/api/messages"
            // socketUrl="/api/socket/messages"
            // socketQuery={{
            //   channelId: channel.id,
            //   serverId: channel.serverId,
            // }}
            paramKey="channelId"
            paramValue={serverChannel?.id}
          />
          <ChatInput
          // name={channel.name}
          // type="channel"
          // apiUrl="/api/socket/messages"
          // query={{
          //   channelId: channel.id,
          //   serverId: channel.serverId,
          // }}
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
