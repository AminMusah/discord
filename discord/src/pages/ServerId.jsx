import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import url from "../api/url";
import Channel from "./Channel";
import ServerSidebar from "../ui-components/server/server-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, getServer } from "../redux/apiCalls";

const ServerId = ({ profile }) => {
  const [server, setServer] = useState(null);
  // const [profile, setProfile] = useState("");

  const params = useParams();

  // useEffect(() => {
  //   const getServer = async () => {
  //     try {
  //       const server = await url.get(`/server/${params?.id}`);
  //       setServers(server?.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getServer();
  // }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getServer(params?.id));
  }, [dispatch]);

  const currentServer = useSelector((state) => state.server.server);

  useEffect(() => {
    setServer(currentServer);
  }, [currentServer]);

  console.log(server);

  return (
    <div>
      <div className="md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        {/* <ServerSidebar servers={profile?.servers} /> */}
      </div>
      {/* <div className="h-full md:pl-60">
        {" "}
        <Channel servers={profile?.servers} user={profile} />
      </div> */}
    </div>
  );
};

export default ServerId;
