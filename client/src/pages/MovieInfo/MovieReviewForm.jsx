import React, { useState, useEffect } from "react";
import { Modal, Rate, message } from "antd";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { AddReview, UpdateReview } from "../../api/review";

const MovieReviewForm = ({
  movie,
  reloadData,
  showReviewForm,
  setShowReviewForm,
  selectedReview,
}) => {
  // State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Variable
  const dispatch = useDispatch();

  // Handler
  const addReview = async () => {
    try {
      dispatch(setLoading(true));
      let response = null;

      if (selectedReview) {
        response = await UpdateReview({
          _id: selectedReview._id,
          movie: movie._id,
          rating,
          comment,
        });
      } else {
        response = await AddReview({
          movie: movie._id,
          rating,
          comment,
        });
      }

      dispatch(setLoading(false));
      message.success(response.message);
      reloadData();
      setShowReviewForm(false);
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // Effect
  useEffect(() => {
    if (selectedReview) {
      setRating(selectedReview.rating);
      setComment(selectedReview.comment);
    }
  }, [selectedReview]);

  return (
    <Modal
      open={showReviewForm}
      onCancel={() => setShowReviewForm(false)}
      centered
      title={selectedReview ? "Update Review" : "Add Review"}
      onOk={addReview}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex w-full">
          <span className="font-semibold">Movie:</span>
          <span className="ml-2 font-semibold">{movie?.name}</span>
        </div>
        <Rate
          value={rating}
          onChange={(value) => setRating(value)}
          allowHalf
          style={{ color: "orange" }}
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment here"
          cols="30"
          rows="10"
        ></textarea>
      </div>
    </Modal>
  );
};

export default MovieReviewForm;
