import axios from "axios";
import qs from "qs";

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

// console.log("Spotify Client ID:", process.env.REACT_APP_SPOTIFY_CLIENT_ID);
// console.log(
//   "Spotify Client Secret:",
//   process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
// );

const getAccessToken = async () => {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const data = qs.stringify({ grant_type: "client_credentials" });
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
  };

  try {
    const response = await axios.post(tokenUrl, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

const getTrackInfo = async (trackUrl) => {
  const trackId = trackUrl.split("/").pop().split("?")[0];
  const accessToken = await getAccessToken();
  const trackApiUrl = `https://api.spotify.com/v1/tracks/${trackId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.get(trackApiUrl, { headers });
    return response.data;
  } catch (error) {
    console.error("Error getting track info:", error);
    throw error;
  }
};

export { getTrackInfo };
