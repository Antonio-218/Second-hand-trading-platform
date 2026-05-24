// import React, { useState } from 'react';
// import { web3,CustomerABI,customerListContract  } from '../contract/second';

// const SubmitReview = () => {
//   const [revieweeAddress, setRevieweeAddress] = useState('');
//   const [content, setContent] = useState('');
//   const [rating, setRating] = useState('');
//   const [imageHash, setImageHash] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleRevieweeAddressChange = (event) => {
//     setRevieweeAddress(event.target.value);
//   };

//   const handleContentChange = (event) => {
//     setContent(event.target.value);
//   };

//   const handleRatingChange = (event) => {
//     setRating(event.target.value);
//   };

//   const handleImageHashChange = (event) => {
//     setImageHash(event.target.value);
//   };

//   const submitReview = async () => {
//     const accounts = await web3.eth.getAccounts();
//     const account = accounts[0];

//     try {
//       const CustomerAddr = await customerListContract.methods.creatorCustomerMap(account).call();
//       const customerContract = await new web3.eth.Contract(CustomerABI, CustomerAddr);
//       await customerContract.methods .submitReview(revieweeAddress, content, rating, imageHash).send({ from: account });
//       alert('Review submitted successfully!');
//       setRevieweeAddress('');
//       setContent('');
//       setRating('');
//       setImageHash('');
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       setErrorMessage('Error submitting review. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h2>Submit Review</h2>
//       <div>
//        <label>Reviewee Address:</label>
//        <input
//           type="text"
//           value={revieweeAddress}
//           onChange={handleRevieweeAddressChange}
//         />
//       </div>
//       <div>
//        <label>Content:</label>
//        <textarea
//           value={content}
//           onChange={handleContentChange}
//         />
//       </div>
//       <div>
//        <label>Rating:</label>
//        <input
//           type="number"
//           value={rating}
//           onChange={handleRatingChange}
//         />
//       </div>
//       <div>
//        <label>Image Hash:</label>
//        <input
//           type="text"
//           value={imageHash}
//           onChange={handleImageHashChange}
//         />
//       </div>
//      <button onClick={submitReview}>Submit Review</button>
//       {errorMessage && (
//         <div>
//           <p>Error: {errorMessage}</p>
//         </div>
//       )}
//     </div>
//   );
// };




// export default SubmitReview;


import React, { useState } from 'react';
import { web3, CustomerABI, customerListContract } from '../contract/second';
import './submit.css'; // 引入样式文件

const SubmitReview = () => {
  const [revieweeAddress, setRevieweeAddress] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('');
  const [imageHash, setImageHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRevieweeAddressChange = (event) => {
    setRevieweeAddress(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleImageHashChange = (event) => {
    setImageHash(event.target.value);
  };

  const submitReview = async () => {
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const CustomerAddr = await customerListContract.methods.creatorCustomerMap(account).call();
      const customerContract = new web3.eth.Contract(CustomerABI, CustomerAddr);
      await customerContract.methods.submitReview(revieweeAddress, content, rating, imageHash).send({ from: account });
      alert('Review submitted successfully!');
      setRevieweeAddress('');
      setContent('');
      setRating('');
      setImageHash('');
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrorMessage('Error submitting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-review-container">
      <h2>Submit Review</h2>
      <div className="form-group">
        <label htmlFor="revieweeAddress">Reviewee Address:</label>
        <input
          id="revieweeAddress"
          type="text"
          value={revieweeAddress}
          onChange={handleRevieweeAddressChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="rating">Rating:</label>
        <input
          id="rating"
          type="number"
          value={rating}
          onChange={handleRatingChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="imageHash">Image Hash:</label>
        <input
          id="imageHash"
          type="text"
          value={imageHash}
          onChange={handleImageHashChange}
        />
      </div>
      <button className="submit-button" onClick={submitReview} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
      {errorMessage && (
        <div className="error-message">
          <p>Error: {errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default SubmitReview;
