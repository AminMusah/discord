import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../redux/apiCalls";
import Sidebar from "../ui-components/navigation/Sidebar";
import { ModalProvider } from "../ui-components/providers/modal-provider";
import ServerId from "./ServerId";

import { useModal } from "../hooks/use-modal-store";

const Server = () => {
  const userId = localStorage.getItem("user");

  const { isOpen } = useModal();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile(userId));
  }, [dispatch, isOpen]);

  const profile = useSelector((state) => state.profile.profile);

  useEffect(() => {
    if (!profile) {
      navigate("/");
    }
  }, []);

  return (
    <div>
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
