import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import url from "../api/url";
import Channel from "./Channel";
import ServerSidebar from "../ui-components/server/server-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, getServer } from "../redux/apiCalls";

const ServerId = ({ profile }) => {
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(getServer(params?.id));
    } catch (error) {
      console.error("Error fetching server:", error);
    }
  }, [dispatch, params?.id]);

  const server = useSelector((state) => state.server.server);

  return (
    <div>
      <div className="md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar server={server} />
      </div>
      <div className="h-full md:pl-60">
        {" "}
        <Channel server={server} profile={profile} />
      </div>
    </div>
  );
};

export default ServerId;
