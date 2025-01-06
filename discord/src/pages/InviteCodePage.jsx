import { useDispatch, useSelector } from "react-redux";
import { getProfile, getServers } from "../redux/apiCalls";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import url from "../api/url";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";

const InviteCodePage = () => {
  const userId = localStorage.getItem("user");
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) navigate("/auth/register"); // Redirect if not logged in
    dispatch(getProfile(userId));
    dispatch(getServers());
  }, [dispatch, userId]);

  const profile = useSelector((state) => state.profile.profile);
  const servers = useSelector((state) => state.server.server);

  useEffect(() => {
    if (!profile) navigate("/"); // Redirect if no profile
  }, [profile, navigate]);

  const existingServer = profile?.servers?.find(
    (server) =>
      server.inviteCode === params.id && server.members.includes(server.profile)
  );

  if (existingServer) {
    navigate(`/server/${existingServer?._id}`);
    return null;
  }

  const server = servers?.find((s) => s.inviteCode === params.id);

  const onNew = async () => {
    if (loading) return; // Prevent duplicate requests
    setLoading(true);

    try {
      const response = await url.post(`/server/createMember`, {
        inviteCode: server?.inviteCode,
      });
      navigate(`/server/${server?._id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error joining server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        {server ? (
          <Button onClick={onNew} disabled={loading}>
            {loading ? "Joining..." : "Join Server"}
          </Button>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-red-400 text-2xl mb-4">Invalid invite code :(</p>

            <Button
              onClick={() => {
                navigate(`/server/${servers[0]?._id}`);
              }}
            >
              Go back
            </Button>
          </div>
        )}
      </div>

      <Toaster position="top-center" richColors />
    </>
  );
};

export default InviteCodePage;
