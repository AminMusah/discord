import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import url from "../api/url";
import Channel from "./Channel";
import ServerSidebar from "../ui-components/server/server-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../redux/apiCalls";

const ServerId = () => {
  const [servers, setServers] = useState(null);
  const [profile, setProfile] = useState("");

  const params = useParams();

  useEffect(() => {
    const getServer = async () => {
      try {
        const server = await url.get(`/server/${params?.id}`);
        setServers(server?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getServer();
  }, [params]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const user = useSelector((state) => state.profile.profile);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  return (
    <div>
      <div className="md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar servers={servers} />
      </div>
      <div className="h-full md:pl-60">
        {" "}
        <Channel servers={servers} user={user} />
      </div>
    </div>
  );
};

export default ServerId;
