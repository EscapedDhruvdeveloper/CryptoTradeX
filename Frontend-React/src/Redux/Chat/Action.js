/* eslint-disable no-unused-vars */
import api from "@/Api/api";
import {
  CHAT_BOT_FAILURE,
  CHAT_BOT_REQUEST,
  CHAT_BOT_SUCCESS,
} from "./ActionTypes";

export const sendMessage = ({ prompt, jwt }) => async (dispatch) => {
  dispatch({
    type: CHAT_BOT_REQUEST,
    payload: { prompt, role: "user" },
  });

  // debug: explicit logs before sending
  console.log("Sending chat request", { prompt, jwtPresent: !!jwt, url: "/chat/bot/coin" });

  try {
    const { data, status } = await api.post(
      "/chat/bot/coin",
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          // axios usually sets Content-Type automatically, but setting explicitly helps debug
          "Content-Type": "application/json",
        },
        timeout: 20000, // optional — useful to fail fast if backend hangs
      }
    );

    console.log("API success", { status, data });

    dispatch({
      type: CHAT_BOT_SUCCESS,
      payload: { ans: data?.message ?? data, role: "model" },
    });
  } catch (error) {
    // More thorough logging for debugging
    console.error("Chat request failed (full error):", error);

    const errPayload = {
      message: error?.response?.data?.error || error?.response?.data || error?.message,
      status: error?.response?.status,
      headers: error?.response?.headers,
      request: error?.request ? true : false,
    };

    console.log("Chat error details:", errPayload);

    dispatch({ type: CHAT_BOT_FAILURE, payload: errPayload });

    // Helpful console output - most useful properties
    if (error.response) {
      // Server returned a response (status code outside 2xx)
      console.log("Server responded:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.log("No response received. Request info:", error.request);
    } else {
      // Something else caused the error
      console.log("Error message:", error.message);
    }
  }
};
