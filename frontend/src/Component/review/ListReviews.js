import React from "react";

export const ListReviews = ({ reviews }) => {
  return (
    <div className="container container-fluid">
      <div className="reviews w-75">
        <h3>Other's Reviews:</h3>
        <hr />
        {reviews &&
          reviews?.map((reviews) => (
            <div key={reviews._id} className="review-card my-3">
              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{ width: `${(reviews?.rating / 5) * 100}%` }}
                ></div>
              </div>
              <p className="review_user">by {reviews?.name}</p>
              <p className="review_comment">{reviews?.comment}</p>

              <hr />
            </div>
          ))}
      </div>
    </div>
  );
};
