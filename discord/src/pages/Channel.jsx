import React, { useEffect, useState } from "react";
import { ChatHeader } from "../ui-components/chat/chat-header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChannel } from "../redux/apiCalls";

const Channel = ({ servers, user }) => {
  const [channels, setChannels] = useState("");

  const params = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChannel());
  }, [dispatch]);

  const channel = useSelector((state) => state?.channel?.channel);

  useEffect(() => {
    setChannels(channel);
  }, [channel]);

  const serverChannel = channel.find((channel) => channel._id === params.id);

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={serverChannel?.name}
        serverId={servers?._id}
        type="channel"
      />
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
