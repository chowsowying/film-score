import apiRequest from "./axios";

export const AddReview = async (payload) => {
  return await apiRequest({
    method: "POST",
    endPoint: "/api/reviews",
    payload,
  });
};

export const GetAllReviews = async (payload) => {
  return await apiRequest({
    method: "GET",
    endPoint: "/api/reviews",
    payload,
    queryStrings: payload,
  });
};

export const UpdateReview = async (payload) => {
  return await apiRequest({
    method: "PUT",
    endPoint: `/api/reviews/${payload._id}`,
    payload,
  });
};

export const DeleteReview = async (payload) => {
  return await apiRequest({
    method: "DELETE",
    endPoint: `/api/reviews/${payload._id}`,
    payload,
  });
};
