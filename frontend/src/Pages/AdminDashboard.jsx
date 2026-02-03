// =============================================
// frontend/src/Pages/AdminDashboard.jsx
// Copy and paste this entire file
// =============================================
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [stats, setStats] = useState({
    urgent: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch complaints from API on component mount
  useEffect(() => {
    fetchComplaints();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filter whenever activeFilter or complaints change
  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, complaints]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/Complaints');
      const data = await response.json();
      setComplaints(data);
      setFilteredComplaints(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setSampleData();
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/Complaints/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const setSampleData = () => {
    const sampleComplaints = [
      {
        id: 1,
        complaintId: 'CMP 10',
        title: 'Lab ac not working',
        description: 'The air conditioning system in the computer lab is not functioning properly. Students are experiencing discomfort during practical sessions.',
        student: 'Ashok Basnet',
        category: 'Infrastructure',
        priority: 'High',
        status: 'Pending',
        createdDate: new Date().toISOString()
      },
      {
        id: 2,
        complaintId: 'CMP 11',
        title: 'Wifi issues',
        description: 'Internet connectivity is very poor in the library area. Unable to access online resources.',
        student: 'Radha Khadka',
        category: 'Infrastructure',
        priority: 'High',
        status: 'In progress',
        createdDate: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        complaintId: 'CMP 12',
        title: 'Library Ac Not working',
        description: 'Library AC has been malfunctioning for the past week.',
        student: 'Kushi Khadka',
        category: 'Facilities',
        priority: 'Medium',
        status: 'Pending',
        createdDate: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 4,
        complaintId: 'CMP 13',
        title: 'Canteen Food quality',
        description: 'The quality of food served in the canteen has deteriorated recently.',
        student: 'Dipti Khadka',
        category: 'Facilities',
        priority: 'Low',
        status: 'Resolved',
        createdDate: new Date(Date.now() - 432000000).toISOString()
      },
      {
        id: 5,
        complaintId: 'CMP 14',
        title: 'Projector not working',
        description: 'Classroom 301 projector is not displaying properly.',
        student: 'Suman Thapa',
        category: 'Academic',
        priority: 'High',
        status: 'Pending',
        createdDate: new Date(Date.now() - 43200000).toISOString()
      }
    ];
    setComplaints(sampleComplaints);
    setFilteredComplaints(sampleComplaints);
    setStats({ urgent: 8, pending: 23, inProgress: 15, resolved: 142 });
    setLoading(false);
  };

  // Filter Logic
  const applyFilter = () => {
    let filtered = [...complaints];

    switch (activeFilter) {
      case 'High Priority':
        filtered = filtered.filter(c => c.priority === 'High');
        break;
      
      case 'Infrastructures':
        filtered = filtered.filter(c => c.category === 'Infrastructure');
        break;
      
      case 'Facilities':
        filtered = filtered.filter(c => c.category === 'Facilities');
        break;
      
      case 'Academic':
        filtered = filtered.filter(c => c.category === 'Academic');
        break;
      
      case 'This Week':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(c => new Date(c.createdDate) >= oneWeekAgo);
        break;
      
      case 'All':
      default:
        filtered = complaints;
        break;
    }

    setFilteredComplaints(filtered);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // View Logic - Opens modal with complaint details
  const handleViewComplaint = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/Complaints/${id}`);
      const data = await response.json();
      setSelectedComplaint(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      // Fallback to finding from local state
      const complaint = complaints.find(c => c.id === id);
      setSelectedComplaint(complaint);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  // Update complaint status
  const updateComplaintStatus = async (id, newStatus) => {
    try {
      const complaint = complaints.find(c => c.id === id);
      const updatedComplaint = { ...complaint, status: newStatus };

      const response = await fetch(`http://localhost:5000/api/Complaints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedComplaint),
      });

      if (response.ok) {
        // Update local state
        setComplaints(complaints.map(c => 
          c.id === id ? { ...c, status: newStatus } : c
        ));
        setSelectedComplaint({ ...selectedComplaint, status: newStatus });
        
        // Refresh stats
        fetchStats();
        
        alert('Status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getDateDisplay = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const filters = ['All', 'High Priority', 'Infrastructures', 'Facilities', 'Academic', 'This Week'];

  return (
    <div className="admin-dashboard">
      <Navbar />
      
      {/* Header Section */}
      <div className="admin-header">
        <div className="header-icon">🎓</div>
        <h1>Smart Feedback System - Admin</h1>
      </div>

      <div className="admin-container">
        {/* Dashboard Title */}
        <div className="dashboard-header">
          <h2>Complaints Dashboard</h2>
          <p className="college-name">Islington College</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card urgent">
            <div className="stat-number">{stats.urgent}</div>
            <div className="stat-label">Urgent</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card in-progress">
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-number">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-section">
          <div className="filter-buttons">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Table */}
        <div className="complaints-section">
          <div className="section-header">
            <h3>Recent Complaints</h3>
            <p className="results-count">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </p>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="no-results">
              <p>No complaints found for the selected filter.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td className="complaint-id">{complaint.complaintId}</td>
                      <td className="complaint-title">{complaint.title}</td>
                      <td>{complaint.student}</td>
                      <td>{complaint.category}</td>
                      <td>
                        <span className={`badge priority-${complaint.priority?.toLowerCase()}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge status-${complaint.status?.toLowerCase().replace(' ', '-')}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>{getDateDisplay(complaint.createdDate)}</td>
                      <td>
                        <button 
                          className="view-btn"
                          onClick={() => handleViewComplaint(complaint.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Viewing Complaint Details */}
      {showModal && selectedComplaint && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Complaint Details</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Complaint ID:</span>
                <span className="detail-value">{selectedComplaint.complaintId}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Title:</span>
                <span className="detail-value">{selectedComplaint.title}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Student:</span>
                <span className="detail-value">{selectedComplaint.student}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{selectedComplaint.category}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Priority:</span>
                <span className={`badge priority-${selectedComplaint.priority?.toLowerCase()}`}>
                  {selectedComplaint.priority}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`badge status-${selectedComplaint.status?.toLowerCase().replace(' ', '-')}`}>
                  {selectedComplaint.status}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Date Submitted:</span>
                <span className="detail-value">
                  {new Date(selectedComplaint.createdDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="detail-row full-width">
                <span className="detail-label">Description:</span>
                <p className="detail-description">
                  {selectedComplaint.description || 'No description provided.'}
                </p>
              </div>
            </div>
            
            <div className="modal-footer">
              <h3>Update Status</h3>
              <div className="status-buttons">
                <button 
                  className="status-update-btn pending-btn"
                  onClick={() => updateComplaintStatus(selectedComplaint.id, 'Pending')}
                  disabled={selectedComplaint.status === 'Pending'}
                >
                  Mark as Pending
                </button>
                <button 
                  className="status-update-btn progress-btn"
                  onClick={() => updateComplaintStatus(selectedComplaint.id, 'In progress')}
                  disabled={selectedComplaint.status === 'In progress'}
                >
                  Mark as In Progress
                </button>
                <button 
                  className="status-update-btn resolved-btn"
                  onClick={() => updateComplaintStatus(selectedComplaint.id, 'Resolved')}
                  disabled={selectedComplaint.status === 'Resolved'}
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;