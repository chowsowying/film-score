import apiRequest from "./axios";

export const RegisterUser = async (payload) => {
  return await apiRequest({
    method: "POST",
    endPoint: "/api/user/register",
    payload,
  });
};

export const LoginUser = async (payload) => {
  return await apiRequest({
    method: "POST",
    endPoint: "/api/user/login",
    payload,
  });
};

export const GetCurrentUser = async () => {
  return await apiRequest({
    method: "GET",
    endPoint: "/api/user/get-current-user",
  });
};

export const UpdateUser = async (payload) => {
  return await apiRequest({
    method: "PUT",
    endPoint: "/api/user/update-user",
    payload,
  });
};

export const GetAllUsers = async () => {
  return await apiRequest({
    method: "GET",
    endPoint: "/api/user/get-all-users",
  });
};
