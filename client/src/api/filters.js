import apiRequest from "./axios";

export const GetSearchResults = async (payload) => {
  return await apiRequest({
    method: "GET",
    endPoint: "/api/filters",
    queryStrings: payload,
  });
};
