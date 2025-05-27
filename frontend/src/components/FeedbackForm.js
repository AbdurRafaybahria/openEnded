import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
    const [formData, setFormData] = useState({
        studentName: '',
        subject: '',
        rating: 1,
        comments: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/feedback', formData);
            setSuccess('Feedback submitted successfully!');
            setFormData({
                studentName: '',
                subject: '',
                rating: 1,
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
        }
    };

    return (
        <div className="feedback-form">
            <h2>Submit Feedback</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Student Name:</label>
                    <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Subject:</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Rating (1-5):</label>
                    <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Comments:</label>
                    <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        rows="4"
                    ></textarea>
                </div>
                <button type="submit">Submit Feedback</button>
            </form>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
        </div>
    );
};

export default FeedbackForm;
