import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../redux/loaderSlice";
import { message, Rate } from "antd";
import { GetAllMovies } from "../api/movie";
import { useNavigate } from "react-router-dom";
import Filters from "../components/Filters";
import { getYear } from "../helpers/helper";

const Home = () => {
  // Get user from redux store
  const { user } = useSelector((state) => state.user);

  // State
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({
    genre: "",
    language: "",
  });

  // Variable
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handler
  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllMovies(filters);
      setMovies(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // Effect
  useEffect(() => {
    getData();
  }, [filters.genre, filters.language]);

  return (
    <div>
      <Filters filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {movies.map((movie) => (
          <div
            key={movie?._id}
            className="p-2 cursor-pointer"
            onClick={() => navigate(`/movie/${movie?._id}`)}>
            <img
              src={
                movie?.posters[0] ||
                "https://res.cloudinary.com/duhdejeyw/image/upload/v1692627752/Image_not_available_zccwig.png"
              }
              alt=""
              className="w-full h-[250px] object-cover rounded shadow-lg"
            />
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-gray-500">
                  {getYear(movie?.releaseDate)} / {movie?.genre}
                </p>
                <h1 className="text-lg font-bold">{movie?.name}</h1>
              </div>
              <div className="bg-primary rounded-full p-5 w-10 h-10 flex items-center justify-center text-white">
                <span>{Math.round(movie?.rating * 10) / 10}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
