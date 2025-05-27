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

    return (
        <div className="feedback-list">
            <h2>Feedback List</h2>
            <div className="filter-section">
                <select value={selectedSubject} onChange={handleSubjectChange}>
                    <option value="">All Subjects</option>
                    {Object.keys(averageRatings).map(subject => (
                        <option key={subject} value={subject}>
                            {subject} (Avg Rating: {averageRatings[subject]})
                        </option>
                    ))}
                </select>
            </div>
            <div className="feedback-table">
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
                                <td>{feedback.rating}</td>
                                <td>{feedback.comments || 'No comments'}</td>
                                <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeedbackList;
