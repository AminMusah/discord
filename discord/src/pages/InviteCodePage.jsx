import { useDispatch, useSelector } from "react-redux";
import { getProfile, getServer } from "../redux/apiCalls";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import url from "../api/url";
import { toast, Toaster } from "sonner";

const InviteCodePage = () => {
  const userId = localStorage.getItem("user");
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProfile(userId));
  }, [dispatch]);

  const profile = useSelector((state) => state.profile.profile);

  useEffect(() => {
    if (!profile) {
      navigate("/");
    }
  }, []);

  if (!params.id) {
    return navigate("/");
  }

  const existingServer = profile?.servers?.find((server) => {
    return (
      server.inviteCode === params.id && server.members.includes(server.profile)
    );
  });

  if (existingServer) {
    return navigate(`/server/${existingServer}`);
  }

  const server = profile?.servers?.find((server) => {
    return server.inviteCode === params.id;
  });

  const onNew = async () => {
    try {
      const response = await url.post(`/server/createMember`, {
        inviteCode: server?.inviteCode,
      });
      console.log(response);
      navigate(`/server/${server?._id}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    onNew();
  }, []);

  return (
    <>
      <Toaster position="top-center" richColors />
    </>
  );
};

export default InviteCodePage;
