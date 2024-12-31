import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import url from "../api/url";
import Channel from "./Channel";
import ServerSidebar from "../ui-components/server/server-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, getServer } from "../redux/apiCalls";
import MemberIdPage from "./Conversation";
import { useModal } from "../hooks/use-modal-store";

const ServerId = ({ profile }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { isOpen } = useModal();

  useEffect(() => {
    try {
      dispatch(getServer(params?.id));
    } catch (error) {
      console.error("Error fetching server:", error);
    }
  }, [dispatch, params?.id, isOpen]);

  useEffect(() => {
    console.log("hello");
  }, [isOpen]);

  const server = useSelector((state) => state.server.server);

  const { channelId, memberId } = params;

  return (
    <div>
      <div className="md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar server={server} profile={profile} />
      </div>
      <div className="h-full md:pl-60">
        {channelId ? (
          <Channel server={server} profile={profile} />
        ) : (
          <MemberIdPage server={server} profile={profile} />
        )}
      </div>
    </div>
  );
};

export default ServerId;
