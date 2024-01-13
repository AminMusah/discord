import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../ui-components/navigation/Sidebar";
import { ModalProvider } from "../ui-components/providers/modal-provider";
import ServerId from "./ServerId";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/apiCalls";
import { useNavigate } from "react-router-dom";
import Channel from "./Channel";

const Server = () => {
  return (
    <div>
      {" "}
      <div className="h-full">
        <div className=" md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
          <ModalProvider />
          <Sidebar />
        </div>
        <main className="md:pl-[72px] h-full">
          <ServerId />
        </main>
      </div>
    </div>
  );
};

export default Server;
