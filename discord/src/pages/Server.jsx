import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../ui-components/navigation/Sidebar";
import { ModalProvider } from "../ui-components/providers/modal-provider";
import ServerId from "./ServerId";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, getProfile } from "../redux/apiCalls";
import { useNavigate } from "react-router-dom";
import Channel from "./Channel";

const Server = () => {
  const [profile, setProfile] = useState("");
  const userId = localStorage.getItem("user");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile(userId));
  }, [dispatch]);

  const user = useSelector((state) => state.profile.profile);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  console.log({ profile });

  return (
    <div>
      {" "}
      <div className="h-full">
        <div className=" md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
          <ModalProvider />
          <Sidebar profile={profile} />
        </div>
        <main className="md:pl-[72px] h-full">
          <ServerId profile={profile} />
        </main>
      </div>
    </div>
  );
};

export default Server;
