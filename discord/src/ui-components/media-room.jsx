import React, { useEffect } from "react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { Track } from "livekit-client";
import { getProfile } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { useModal } from "../hooks/use-modal-store";

const serverUrl = import.meta.env.VITE_WEB_SOCKET_URL;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzU3ODM5NzAsImlzcyI6IkFQSTNUVWZ6TGZUd3VIYyIsIm5iZiI6MTczNTc3Njc3MCwic3ViIjoicXVpY2tzdGFydCB1c2VyIDd2MjQxOCIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.-YZknqO-s44fFUnHsWWjLD2lB0Cw3vo_Ct9PnVg5cO4";

const MediaRoom = ({ video, audio, chatId }) => {
  const userId = localStorage.getItem("user");
  //   const [token, setToken] = useState("");
  const dispatch = useDispatch();

  const { isOpen } = useModal();

  useEffect(() => {
    dispatch(getProfile(userId));
  }, [dispatch, isOpen]);

  const profile = useSelector((state) => state.profile.profile);

  useEffect(() => {
    if (!profile) {
      // navigate("/");
      return;
    }
    console.log(profile?.name, "name");
    const name = `${profile?.name}`;
    (async () => {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username${name}`);
        const data = await res.json();
        // setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [profile?.name, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      serverUrl={serverUrl}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
  share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  );
};

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}

export default MediaRoom;
