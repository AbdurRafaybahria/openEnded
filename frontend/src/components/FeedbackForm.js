import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
    const [formData, setFormData] = useState({
        studentName: '',
        subject: '',
        rating: 3, // Default to middle rating
        comments: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/feedback', formData);
            setSuccess('✅ Feedback submitted successfully!');
            setFormData({
                studentName: '',
                subject: '',
                rating: 3,
                comments: ''
            });
            setError('');
            
            // Notify parent component that feedback was submitted
            if (onFeedbackSubmitted) {
                onFeedbackSubmitted();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting feedback');
            setSuccess('');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Generate star rating UI
    const renderRatingStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span 
                    key={i} 
                    className={`star ${parseInt(formData.rating) >= i ? 'filled' : ''}`}
                    onClick={() => setFormData({...formData, rating: i})}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="feedback-form">
            <h2>Submit Feedback</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="studentName">Student Name</label>
                    <input
                        id="studentName"
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                        id="subject"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter subject name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Rating</label>
                    <div className="star-rating">
                        {renderRatingStars()}
                        <span className="rating-text">{formData.rating} of 5</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="comments">Comments (Optional)</label>
                    <textarea
                        id="comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        placeholder="Share your thoughts about this subject..."
                        rows="4"
                    ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
            {error && <div className="error">❌ {error}</div>}
            {success && <div className="success">{success}</div>}
        </div>
    );
};

export default FeedbackForm;
