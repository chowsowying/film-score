import axios from "axios";

const baseURL = "https://film-score-server.onrender.com";

const apiRequest = async ({ method, endPoint, payload, queryStrings }) => {
  try {
    const response = await axios({
      method,
      url: `${baseURL}${endPoint}`,
      data: payload,
      params: queryStrings,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.message || "Something went wrong");
  }
};

export default apiRequest;
