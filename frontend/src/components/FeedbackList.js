import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const FeedbackList = ({ refreshTrigger }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [averageRatings, setAverageRatings] = useState({});
    
    const fetchFeedbacks = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/feedbacks');
            setFeedbacks(response.data);
            calculateAverageRatings(response.data);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    }, []);

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks, refreshTrigger]);

    const calculateAverageRatings = (feedbacks) => {
        const ratingsBySubject = {};
        feedbacks.forEach(feedback => {
            if (!ratingsBySubject[feedback.subject]) {
                ratingsBySubject[feedback.subject] = { total: 0, count: 0 };
            }
            ratingsBySubject[feedback.subject].total += feedback.rating;
            ratingsBySubject[feedback.subject].count += 1;
        });

        const avgRatings = {};
        Object.entries(ratingsBySubject).forEach(([subject, data]) => {
            avgRatings[subject] = (data.total / data.count).toFixed(1);
        });
        setAverageRatings(avgRatings);
    };

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const filteredFeedbacks = selectedSubject 
        ? feedbacks.filter(f => f.subject === selectedSubject)
        : feedbacks;
        
    // Function to render star rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`table-star ${i <= rating ? 'filled' : ''}`}>
                    ★
                </span>
            );
        }
        return <div className="star-display">{stars}</div>;
    };

    return (
        <div className="feedback-list">
            <h2>Feedback List</h2>
            <div className="filter-section">
                <label htmlFor="subject-filter">Filter by Subject:</label>
                <select 
                    id="subject-filter"
                    value={selectedSubject} 
                    onChange={handleSubjectChange}
                >
                    <option value="">All Subjects</option>
                    {Object.keys(averageRatings).map(subject => (
                        <option key={subject} value={subject}>
                            {subject} (Avg Rating: {averageRatings[subject]})
                        </option>
                    ))}
                </select>
            </div>
            
            {selectedSubject && (
                <div className="average-rating-display">
                    <h3>Average Rating for {selectedSubject}</h3>
                    <div className="large-rating">
                        {renderStars(parseFloat(averageRatings[selectedSubject]))}
                        <span className="large-rating-number">{averageRatings[selectedSubject]}</span>
                    </div>
                </div>
            )}
            <div className="feedback-table">
                {filteredFeedbacks.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Subject</th>
                                <th>Rating</th>
                                <th>Comments</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeedbacks.map((feedback) => (
                                <tr key={feedback._id}>
                                    <td>{feedback.studentName}</td>
                                    <td>{feedback.subject}</td>
                                    <td>{renderStars(feedback.rating)}</td>
                                    <td className="comments-cell">{feedback.comments || 'No comments'}</td>
                                    <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-feedback">
                        <div className="no-data-icon">📋</div>
                        <p>No feedback entries found{selectedSubject ? ` for ${selectedSubject}` : ''}.</p>
                        {selectedSubject && (
                            <button className="small-button" onClick={() => setSelectedSubject('')}>
                                Show All Feedback
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackList;
