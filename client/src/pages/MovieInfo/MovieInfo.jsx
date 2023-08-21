import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { Button, message, Rate, Modal } from "antd";
import { GetMovieById } from "../../api/movie";
import { useNavigate, useParams } from "react-router-dom";
import { getDateTimeFormat, getDateFormat } from "../../helpers/helper";
import MovieReviewForm from "./MovieReviewForm";
import { GetAllReviews } from "../../api/review";
import { useMediaQuery } from "react-responsive";

const MovieInfo = () => {
  // State
  const [movie, setMovie] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const [showFullSizePhoto, setShowFullSizePhoto] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState("");
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Variable
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const posters = movie?.posters;
  const isMediumScreen = useMediaQuery({ maxWidth: 1024 });

  // Handler
  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetMovieById(id);
      const reviewsResponse = await GetAllReviews({ movie: id });
      setReviews(reviewsResponse.data);
      setMovie(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  const handleNext = () => {
    setCurrentPosterIndex((prevIndex) => (prevIndex + 1) % posters.length);
  };

  const handleBack = () => {
    setCurrentPosterIndex((prevIndex) => (prevIndex - 1 + posters.length) % posters.length);
  };

  const handleTogglePhoto = (poster) => {
    if (showFullSizePhoto) {
      setSelectedPoster("");
      setShowFullSizePhoto(false);
    } else {
      setSelectedPoster(poster);
      setShowFullSizePhoto(true);
    }
  };

  // Helper function to truncate the synopsis to a specific number of words
  const truncateSynopsis = (text, maxLength) => {
    if (!text) {
      return "";
    }

    const words = text.split(" ");
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(" ") + "...";
    }
    return text;
  };

  const showFullSynosisModal = () => {
    setIsModalVisible(true);
  };

  const hideFullSynosisModal = () => {
    setIsModalVisible(false);
  };

  const getYouTubeVideoId = (url) => {
    const videoIdRegex =
      /(?:\?v=|\/embed\/|\.be\/|\/watch\?v=|\/v\/|youtu\.be\/|\/embed\/|\/watch\?v=|\/v\/|\/e\/|youtu\.be\/|\/embed\/|\/watch\?v=|\/v\/|youtu\.be\/|\/embed\/|\/watch\?v=|\/v\/|youtu\.be\/|\/embed\/|\/watch\?v=|\/v\/)([^&\n?#]+)/;
    const match = url?.match(videoIdRegex);
    return match && match[1];
  };

  // Extract the video ID from the movie's trailer URL
  const videoId = getYouTubeVideoId(movie?.trailer);

  // Effect
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (showFullSizePhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showFullSizePhoto]);

  return (
    movie && (
      <div>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cover Img + Movie Details */}
          <div className="flex flex-col gap-5">
            <img
              src={movie?.posters[0] || ""}
              alt=" "
              className="w-full lg:w-[600px] h-auto rounded shadow-lg"
            />
            {videoId && (
              <iframe
                title="Trailer"
                height={"340px"}
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allowFullScreen></iframe>
            )}
          </div>
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex flex-row gap-10 items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">{movie?.name}</h1>
                <div className="flex flex-row gap-3 text-gray-500 items-center">
                  <p className="age-restriction">{movie?.ageRestriction} +</p>
                  <p>{movie?.genre}</p>
                </div>
              </div>
              <div className="bg-primary rounded-full p-5 w-16 h-16 flex items-center justify-center text-white text-xl gap-1">
                <span>{Math.round(movie?.rating * 10) / 10}</span>
                <i class="ri-star-fill"></i>
              </div>
            </div>

            {/* About the Film */}
            <div className="flex flex-col gap-2 w-full  text-md text-gray-500 mt-5 ">
              <h2 className="font-semibold text-black my-5">About the film</h2>
              <div className="flex flex-row gap-20">
                <div className="flex flex-col gap-5">
                  <span>Language</span>
                  <span>Release Date</span>
                  <span>Genre</span>
                  <span>Director</span>
                  <span>Heroine</span>
                  <span>Hero</span>
                </div>
                <div className="flex flex-col gap-5">
                  <span>{movie?.language}</span>
                  <span>{getDateFormat(movie?.releaseDate)}</span>
                  <span>{movie?.genre}</span>
                  <span>{movie?.director.name}</span>
                  <span>{movie?.heroine.name}</span>
                  <span>{movie?.hero.name}</span>
                </div>
              </div>
              {/* Movie Description */}
              <div className="bg-gray-100 rounded-md p-5 mt-5">
                <h1 className="text-xl font-semibold text-gray-600 mt-2">Synopsis</h1>
                <div className="my-5 text-gray-600">
                  {showFullSynopsis ? movie?.plot : truncateSynopsis(movie?.plot, 100)}
                </div>
                {!showFullSynopsis && (
                  <a
                    onClick={showFullSynosisModal}
                    className="text-primary hover:underline focus:outline-none">
                    Read More
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* More Posters */}
        {posters.length > 1 && (
          <div className="mt-5 ">
            <h1 className="text-xl font-semibold text-gray-600">More Posters</h1>
            {isMediumScreen ? (
              <div className="mt-3 relative">
                <div className="flex flex-row mt-5 gap-5">
                  {posters.map((poster, index) => (
                    <img
                      key={index}
                      src={poster}
                      alt=""
                      className={`w-full lg:w-[200px]  rounded shadow-lg ${
                        index === currentPosterIndex ? "block" : "hidden"
                      }`}
                    />
                  ))}
                  <button
                    onClick={handleBack}
                    className={`rounded-full py-2 px-2 absolute top-1/2 left-2 transform -translate-y-1/2 bg-primary ${
                      currentPosterIndex === 0 ? "invisible" : "visible"
                    }`}>
                    <i className="ri-arrow-left-s-line text-white"></i>
                  </button>
                  <button
                    onClick={handleNext}
                    className={`rounded-full py-2 px-2 absolute top-1/2 right-2 transform -translate-y-1/2 bg-primary ${
                      currentPosterIndex === posters.length - 1 ? "invisible" : "visible"
                    }`}>
                    <i className="ri-arrow-right-s-line text-white flex justify-center items-center"></i>
                  </button>
                </div>
              </div>
            ) : (
              // Large Screen
              <div>
                <div className="flex flex-row mt-5 gap-5 overflow-x-auto">
                  {posters.map((poster, index) => (
                    <img
                      key={index}
                      src={poster}
                      alt=""
                      className="w-full lg:w-[150px] h-auto rounded shadow-lg"
                      onClick={() => handleTogglePhoto(poster)}
                    />
                  ))}
                </div>

                {showFullSizePhoto && (
                  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
                    <div className="relative">
                      <img src={selectedPoster} alt="" className="w-[800px]" />
                      <button
                        onClick={handleTogglePhoto}
                        className="absolute top-2 right-2 text-white bg-primary rounded-full px-2 focus:outline-none ">
                        <i className="ri-close-line items-center justify-center flex "></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* Cast */}
        <div className="mt-5">
          <h1 className="text-xl font-semibold text-gray-600">Cast Details</h1>

          <div className="flex flex-col lg:flex-row mt-5 gap-5">
            {movie?.cast.map((artist) => (
              <div
                className="cursor-pointer flex items-center bg-gray-100 rounded p-2"
                key={artist?._id}
                onClick={() => navigate(`/artist/${artist?._id}`)}>
                <img
                  src={artist?.images[0] || ""}
                  alt=""
                  className="w-[70px] h-[100px] rounded object-cover"
                />
                <div className="ml-2">
                  <span className="text-sm block font-semibold">{artist.name}</span>
                  <span className="text-sm block text-gray-500">{artist.profession}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Review and Rating */}
        <div className="mt-5 mb-10"></div>
        <hr />
        <div className="flex justify-between items-center mt-5">
          <span className="text-xl font-semibold">Reviews</span>
          <Button type="default" onClick={() => setShowReviewForm(true)}>
            Add Review
          </Button>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          {reviews.map((review) => (
            <div
              className="flex justify-between border-solid border p-2 rounded-sm border-gray-300"
              key={review?._id}>
              <div className="flex flex-col">
                <span className="text-gray-600 font-semibold text-md">{review?.user?.name}</span>
                <Rate
                  disabled
                  value={review?.rating}
                  style={{ color: "orange" }}
                  className="mt-2"
                  allowHalf
                />
                <span className="text-gray-600 text-sm mt-3">{review?.comment}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-600 text-sm">
                  {getDateTimeFormat(review?.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
        {showReviewForm && (
          <MovieReviewForm
            movie={movie}
            reloadData={getData}
            showReviewForm={showReviewForm}
            setShowReviewForm={setShowReviewForm}
          />
        )}
        <Modal
          title="Synosis"
          open={isModalVisible}
          onOk={hideFullSynosisModal}
          onCancel={hideFullSynosisModal}
          width={800}
          centered>
          <p>{movie?.plot}</p>
        </Modal>
      </div>
    )
  );
};

export default MovieInfo;
