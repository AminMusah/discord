import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import url from "../api/url";
import Channel from "./Channel";
import ServerSidebar from "../ui-components/server/server-sidebar";

const ServerId = () => {
  const [servers, setServers] = useState(null);
  const params = useParams();

  useEffect(() => {
    const getServer = async () => {
      try {
        const server = await url.get(`/server/${params?.id}`);
        console.log(server?.data);
        setServers(server?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getServer();
  }, [params]);

  return (
    <div>
      <div className="md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar servers={servers} />
      </div>
      <div className="h-full md:pl-60">
        {" "}
        <Channel />
      </div>
    </div>
  );
};

export default ServerId;
