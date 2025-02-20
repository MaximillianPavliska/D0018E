import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import configfile from "../../../Data/configReact";
import "../styles/bookdetail.css";

function BookDetail() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
        const token = localStorage.getItem("token"); // Retrieve token
    
        if (!token) {
          console.log("User is not authenticated");
          return;
        }
    
        const response = await fetch(`http://${configfile.HOST}:3000/home`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` // Use token or authentication
          }
        });
    
        const data = await response.json();
        console.log("Data:", data);  
        if (response.ok) {
          setUserId(data.user.UserID);
          console.log("User ID:", data.user.UserID);
        } else {
          console.log("Not authenticated");
          setUserId(null);
        }
      };

    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://${configfile.HOST}:3000/api/books/${bookId}`);
        if (!response.ok) throw new Error("Book not found");
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://${configfile.HOST}:3000/api/reviews/${bookId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchUser();
    fetchBookDetails();
    fetchReviews();
  }, [bookId]);

  const handleAddToCart = async () => {
    console.log("User ID:", userId);
    try {
      const response = await fetch(`http://${configfile.HOST}:3000/api/cart/addtoCart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, BookID: bookId })
      });
      
      if (!response.ok) throw new Error("Failed to add to cart");
      alert("Added to cart successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://${configfile.HOST}:3000/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          userId,
          rating,
          comment
        })
      });

      if (response.ok) {
        setRating(0);
        setComment("");
        alert("Review submitted successfully!");
      }
    } catch (err) {
      console.error("Review submission error:", err);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <div className="book-detail-container">
        <h1>{book.Title}</h1>
        <div className="book-info">
          <p>Author: {book.Author}</p>
          <p>Genre: {book.Genre}</p>
          <p>Price: ${book.Price}</p>
          <p>Pages: {book.Pages}</p>
          <p>Stock: {book.Stock}</p>
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>

        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          <form onSubmit={handleReviewSubmit}>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`star ${star <= rating ? "filled" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
            />
            <button type="submit">Submit Review</button>
          </form>

          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.ReviewID} className="review-item">
                <div className="review-rating">
                  {Array(review.Rating).fill("★").join("")}
                </div>
                <p>{review.Comment}</p>
                <small>By User {review.UserID}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
