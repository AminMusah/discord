const { AccessToken } = require("livekit-server-sdk");
const Profile = require("../model/Profile");

const createToken = async (req, res) => {
  try {
    const { room } = req.query;

    const { _id } = req.user;

    const profile = await Profile.findById(_id);

    // If this room doesn't exist, it'll be automatically created when the first
    // participant joins
    const roomName = `${room}`;
    // Identifier to be used for participant.
    // It's available as LocalParticipant.identity with livekit-client SDK
    const participantName = `${profile?.name}` || "participant";

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName,
        // Token to expire after 10 minutes
        ttl: "10m",
      }
    );
    at.addGrant({ roomJoin: true, room: roomName });
    const data = await at.toJwt();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error livekit:", error);
    res.status(500).json({ error: "Error livekit" });
  }
};

module.exports = { createToken };
