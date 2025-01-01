import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import url from "../api/url";
import { ChatHeader } from "../ui-components/chat/chat-header";
import { ChatInput } from "../ui-components/chat/chat-input";
import { ChatMessages } from "../ui-components/chat/chat-messages";

const MemberIdPage = ({ profile }) => {
  const params = useParams();
  const [currentMember, setCurrentMember] = useState(null);
  const [conversation, setConversation] = useState(null);
  const navigate = useNavigate();
  const { memberId, id } = params;

  const getCurrentMember = async () => {
    try {
      const queryParams = new URLSearchParams({
        serverId: id,
      }).toString();

      const endpoint = `/members/current-member?${queryParams}`;
      const response = await url.get(endpoint);
      setCurrentMember(response.data?._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentMember();
  }, []);

  // useEffect(() => {
  //   if (!currentMember) {
  //     navigate(`/server/${id}`);
  //   }
  // }, [
  //   currentMember
  //   , id, navigate]);

  const getOrCreateConversation = async (memberOneId, memberTwoId) => {
    try {
      const response = await url.post(`conversation`, {
        memberOneId,
        memberTwoId,
      });
      setConversation(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrCreateConversation(currentMember, memberId);
  }, [currentMember, memberId]);

  // useEffect(() => {
  //   if (!conversation || conversation === null) {
  //     navigate(`/server/${id}`);
  //   }
  // }, [conversation, id, navigate]);

  let memberOneId, memberTwoId;
  if (conversation) {
    memberOneId = conversation.memberOneId;
    memberTwoId = conversation.memberTwoId;
  }

  const otherMember =
    memberOneId?.profile?._id === profile?._id ? memberTwoId : memberOneId;

  console.log(otherMember, "other");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      <ChatHeader
        imageUrl={otherMember?.profile?.imageUrl}
        name={otherMember?.profile?.name}
        serverId={params.id}
        type="conversation"
      />
      {/* {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )} */}
      {/* {!searchParams.video && ( */}
      <>
        <ChatMessages
          member={currentMember}
          name={otherMember?.profile?.name || ""}
          chatId={conversation?._id}
          type="conversation"
          apiUrl="/direct-messages"
          // paramKey={conversationId}
          paramKey={conversation?._id}
          paramValue={conversation?._id}
          socketUrl="/socket/direct-message"
          socketQuery={{
            conversationId: conversation?._id,
          }}
        />
        <ChatInput
          name={otherMember?.profile?.name || ""}
          type="conversation"
          apiUrl="/socket/direct-message"
          query={{
            conversationId: conversation?._id,
          }}
        />
      </>
      {/* )} */}
    </div>
  );
};

export default MemberIdPage;
