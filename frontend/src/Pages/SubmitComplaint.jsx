import React, { useState } from 'react';
import './SubmitComplaint.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SubmitComplaint() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    file: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'infrastructure', name: 'Infrastructure', icon: '🏢' },
    { id: 'facilities', name: 'Facilities', icon: '🚪' },
    { id: 'academic', name: 'Academic', icon: '📚' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'administration', name: 'Administration', icon: '🎯' },
    { id: 'others', name: 'Others', icon: '❓' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Sending data to backend
      const response = await fetch("http://localhost:5064/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          status: "Pending",
          userId: 1  
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Complaint submitted successfully! Tracking ID: CMP${String(data.id).padStart(6, '0')}`);
        // Reset form
        setFormData({
          title: '',
          category: '',
          description: '',
          file: null
        });
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Error submitting complaint. Try again later.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Server error. Please check backend.");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Navbar />
  
      <div className="submit-complaint-container">
        <div className="complaint-header-banner">
          <h1>📝 Submit a Complaint</h1>
        </div>

        <div className="complaint-form-card">
          <div className="info-box">
            <h3>💡 Before you submit:</h3>
            <ul>
              <li>Be clear and specific about your issue</li>
              <li>You'll receive a tracking ID to monitor progress</li>
              <li>Admin will review and respond within 48 hours</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Complaint Title <span className="required">*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of the issues"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <div className="category-grid">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-card ${formData.category === cat.id ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    <div className="category-icon">{cat.icon}</div>
                    <div className="category-name">{cat.name}</div>
                  </button>
                ))}
              </div>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description <span className="required">*</span></label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information..."
                rows="6"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            {/* File Upload (Optional) */}
            <div className="form-group">
              <label>Attach file (Optional)</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              {errors.file && <span className="error-message">{errors.file}</span>}
            </div>

            {/* Buttons */}
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => window.history.back()}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}