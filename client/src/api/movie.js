import apiRequest from "./axios";

export const AddMovie = async (payload) => {
  return await apiRequest({
    method: "POST",
    endPoint: "/api/movies",
    payload,
  });
};

export const GetAllMovies = async (payload) => {
  return await apiRequest({
    method: "GET",
    endPoint: "/api/movies",
    queryStrings: payload,
  });
};

export const GetMovieById = async (id) => {
  return await apiRequest({
    method: "GET",
    endPoint: `/api/movies/${id}`,
  });
};

export const UpdateMovie = async (id, payload) => {
  return await apiRequest({
    method: "PUT",
    endPoint: `/api/movies/${id}`,
    payload,
  });
};

export const DeleteMovie = async (id) => {
  return await apiRequest({
    method: "DELETE",
    endPoint: `/api/movies/${id}`,
  });
};

export const GetMoviesByArtistId = async (id) => {
  return await apiRequest({
    method: "GET",
    endPoint: `/api/movies/get-movies-by-artist/${id}`,
  });
};
