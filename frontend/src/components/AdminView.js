import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminView = () => {
    const [dbData, setDbData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (isLoading) return <div className="loading">Loading database data...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-view">
            <h2>MongoDB Data Viewer</h2>
            <p>Total entries: {dbData.length}</p>
            <div className="db-data">
                <pre>{JSON.stringify(dbData, null, 2)}</pre>
            </div>
        </div>
    );
};

export default AdminView;
