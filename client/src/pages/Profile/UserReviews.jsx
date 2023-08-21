import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { message, Rate, Table } from "antd";
import { getDateTimeFormat } from "../../helpers/helper";
import { GetAllReviews, DeleteReview } from "../../api/review";
import MovieReviewForm from "../MovieInfo/MovieReviewForm";

const UserReviews = () => {
  // Variable
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // State
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Handler
  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const reviewsResponse = await GetAllReviews({ user: user._id });
      setReviews(reviewsResponse.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  const deleteReview = async (review) => {
    try {
      dispatch(setLoading(true));
      const response = await DeleteReview({
        _id: review._id,
        movie: review.movie._id,
      });
      message.success(response.message);
      getData();
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Movie",
      dataIndex: "movie",
      render: (text, record) => record.movie.name,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (text, record) => (
        <Rate
          disabled
          allowHalf
          value={record.rating}
          style={{ color: "orange" }}
        />
      ),
    },
    {
      title: "Review",
      dataIndex: "comment",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) => getDateTimeFormat(record.createdAt),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5">
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedReview(record);
                setShowReviewForm(true);
              }}
            ></i>
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                deleteReview(record);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  // Effect
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="table-responsive">
        <Table dataSource={reviews} columns={columns} />
      </div>

      {showReviewForm && (
        <MovieReviewForm
          movie={selectedReview.movie}
          showReviewForm={showReviewForm}
          setShowReviewForm={setShowReviewForm}
          selectedReview={selectedReview}
          reloadData={getData}
        />
      )}
    </div>
  );
};

export default UserReviews;
