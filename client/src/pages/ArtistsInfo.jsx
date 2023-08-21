import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../redux/loaderSlice";
import { Button, message, Rate, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { GetArtistById } from "../api/artists";
import { getDateFormat } from "../helpers/helper";
import { GetMoviesByArtistId } from "../api/movie";

const ArtistsInfo = () => {
  // State
  const [artists, setArtists] = useState(null);
  const [movies, setMovies] = useState([]);
  const [showFullBio, setShowFullBio] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Variable
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Handler
  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const artistsResponse = await GetArtistById(id);
      setArtists(artistsResponse.data);
      const moviesResponse = await GetMoviesByArtistId(id);
      setMovies(moviesResponse.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  const truncateBio = (text, maxLength) => {
    if (!text) {
      return "";
    }

    const words = text.split(" ");
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(" ") + "...";
    }
    return text;
  };

  const showFullBioModal = () => {
    setIsModalVisible(true);
  };

  const hideFullBioModal = () => {
    setIsModalVisible(false);
  };

  // Effect
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col  md:flex-row gap-10">
      {/* Cover Img + Movie Details */}
      <div className="flex flex-col gap-10 shadow-lg p-5 rounded-md">
        <img
          src={artists?.images[0] || ""}
          alt=""
          className="w-full h-auto md:w-[300px] md:h-[400px] rounded shadow-lg"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold mb-2">{artists?.name}</h1>
          <div className="flex flex-col gap-2 w-full md:w-[300px] text-md text-gray-500 mt-5">
            <div className="flex flex-col">
              <span className="text-black font-bold text-sm">Profession</span>
              <span>{artists?.profession}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-black font-bold text-sm">DOB</span>
              <span>{getDateFormat(artists?.dob)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-black font-bold text-sm">Debut Year</span>
              <span>{artists?.debutYear}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-black font-bold text-sm">Debut Movie</span>
              <span>{artists?.debutMovie}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-black font-bold text-sm">Bio</span>
              <span>
                {artists?.bio && (
                  <div className="mb-5">
                    {showFullBio ? artists.bio : truncateBio(artists.bio, 100)}
                  </div>
                )}
              </span>
              {artists?.bio && artists.bio.length > 100 && (
                <div>
                  {!showFullBio && (
                    <a
                      onClick={showFullBioModal}
                      className="text-primary hover:underline focus:outline-none">
                      Read More
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movies */}
      <div className="mt-5">
        <h1 className="text-xl font-semibold">Movies</h1>

        <div className="grid grid-cols-1  lg:grid-cols-4 gap-5">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                className="cursor-pointer flex flex-col items-center shadow-lg rounded p-2 hover:bg-gray-200"
                key={movie?._id}
                onClick={() => navigate(`/movie/${movie?._id}`)}>
                <img
                  src={movie?.posters[0] || ""}
                  alt=""
                  className="w-full h-full rounded object-cover"
                />
                <div className="mt-2">
                  <span className="text-sm font-semibold">{movie?.name}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No movies available</p>
          )}
        </div>
      </div>

      {/* Bio Modal */}
      <Modal
        title="Bio"
        open={isModalVisible}
        onOk={hideFullBioModal}
        onCancel={hideFullBioModal}
        width={800}
        centered>
        <p>{artists?.bio}</p>
      </Modal>
    </div>
  );
};

export default ArtistsInfo;
