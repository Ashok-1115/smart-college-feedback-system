import React, { useState, useEffect } from 'react';

export default function RecentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:5064/api/complaints');
      if (response.ok) {
        const data = await response.json();
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComplaints(sorted);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Recent Complaints</h3>

      {loading ? (
        <p>Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints submitted yet</p>
      ) : (
        <>
          {complaints.slice(0, 5).map((complaint) => (
            <div 
              key={complaint.id} 
              style={{
                background: 'white',
                padding: '15px 20px',
                marginBottom: '15px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '16px' }}>{complaint.title}</strong>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: complaint.status === 'Pending' ? '#fff3cd' : '#d4edda',
                  color: complaint.status === 'Pending' ? '#856404' : '#155724'
                }}>
                  {complaint.status}
                </span>
              </div>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                ID: CMP{String(complaint.id).padStart(6, '0')} · Submitted {formatDate(complaint.createdAt)}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}