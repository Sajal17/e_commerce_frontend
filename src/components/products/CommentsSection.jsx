import React, { useState } from "react";

const CommentsSection = ({ reviews = [], onSubmitReview }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

      {reviews.length ? (
        <div className="flex flex-col gap-4 max-h-80 overflow-y-auto">
          {reviews.map((r, idx) => (
            <div key={idx} className="border-b pb-2">
              <p className="font-semibold">{r.user}</p>
              <p className="text-sm text-gray-600">{r.comment}</p>
              <p className="text-yellow-500 text-sm">★ {r.rating}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Write a Review</h4>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows={3}
          placeholder="Write your review..."
        />
        <div className="flex items-center gap-2 mb-2">
          <label>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} ★
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => onSubmitReview({ comment, rating })}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;
