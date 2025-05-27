import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminView = () => {
    const [dbData, setDbData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'json'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:5000/api/feedbacks');
                setDbData(response.data);
                setError('');
            } catch (err) {
                setError('Error fetching database data');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // Set up auto-refresh every 5 seconds
        const intervalId = setInterval(fetchData, 5000);
        
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Function to calculate statistics
    const calculateStats = () => {
        if (!dbData.length) return { avgRating: 0, subjects: 0, highestRated: null };
        
        const subjects = new Set();
        let totalRating = 0;
        let highestRated = { subject: '', rating: 0 };
        
        // Group by subject
        const subjectRatings = {};
        
        dbData.forEach(feedback => {
            subjects.add(feedback.subject);
            totalRating += feedback.rating;
            
            if (!subjectRatings[feedback.subject]) {
                subjectRatings[feedback.subject] = { total: 0, count: 0 };
            }
            
            subjectRatings[feedback.subject].total += feedback.rating;
            subjectRatings[feedback.subject].count += 1;
        });
        
        // Find highest rated subject
        Object.entries(subjectRatings).forEach(([subject, data]) => {
            const avgRating = data.total / data.count;
            if (avgRating > highestRated.rating) {
                highestRated = { subject, rating: avgRating };
            }
        });
        
        return {
            avgRating: (totalRating / dbData.length).toFixed(1),
            subjects: subjects.size,
            highestRated
        };
    };
    
    const stats = calculateStats();

    if (isLoading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading database data...</p>
        </div>
    );
    
    if (error) return <div className="error">❌ {error}</div>;

    return (
        <div className="admin-view">
            <div className="admin-header">
                <h2>MongoDB Data Viewer</h2>
                <div className="view-toggle">
                    <button 
                        className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                    >
                        Table View
                    </button>
                    <button 
                        className={`toggle-btn ${viewMode === 'json' ? 'active' : ''}`}
                        onClick={() => setViewMode('json')}
                    >
                        JSON View
                    </button>
                </div>
            </div>
            
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                        <h3>Total Entries</h3>
                        <div className="stat-value">{dbData.length}</div>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                        <h3>Average Rating</h3>
                        <div className="stat-value">{stats.avgRating}</div>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">📖</div>
                    <div className="stat-info">
                        <h3>Total Subjects</h3>
                        <div className="stat-value">{stats.subjects}</div>
                    </div>
                </div>
                
                {stats.highestRated && stats.highestRated.subject && (
                    <div className="stat-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-info">
                            <h3>Highest Rated</h3>
                            <div className="stat-value">{stats.highestRated.subject}</div>
                            <div className="stat-subtext">{stats.highestRated.rating.toFixed(1)} / 5</div>
                        </div>
                    </div>
                )}
            </div>
            
            {viewMode === 'table' ? (
                <div className="admin-table-container">
                    <h3>Feedback Data</h3>
                    {dbData.length > 0 ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Student</th>
                                    <th>Subject</th>
                                    <th>Rating</th>
                                    <th>Comments</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dbData.map(item => (
                                    <tr key={item._id}>
                                        <td className="id-cell">{item._id}</td>
                                        <td>{item.studentName}</td>
                                        <td>{item.subject}</td>
                                        <td>{item.rating}</td>
                                        <td className="comments-cell">{item.comments || 'No comments'}</td>
                                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data">No feedback entries found</div>
                    )}
                </div>
            ) : (
                <div className="db-data">
                    <h3>JSON Data</h3>
                    <pre>{JSON.stringify(dbData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default AdminView;
