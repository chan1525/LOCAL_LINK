import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [userType, setUserType] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('personal');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      
      // Check business owner first
      const businessRef = doc(db, 'business_owners', user.uid);
      const businessSnap = await getDoc(businessRef);
      if (businessSnap.exists()) {
        setUserType('business');
        setForm(businessSnap.data());
        setLoading(false);
        return;
      }
      
      // Check individual
      const individualRef = doc(db, 'individuals', user.uid);
      const individualSnap = await getDoc(individualRef);
      if (individualSnap.exists()) {
        setUserType('individual');
        setForm(individualSnap.data());
        setLoading(false);
        return;
      }
      
      setError('User not found.');
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');
      
      const ref = doc(db, userType === 'business' ? 'business_owners' : 'individuals', user.uid);
      const { email, password, uid, ...updateData } = form;
      
      // Include new image if uploaded
      if (imagePreview) {
        updateData.image = imagePreview;
      }
      
      await updateDoc(ref, updateData);
      setSuccess(true);
      
      // Update form with new image
      if (imagePreview) {
        setForm(prev => ({ ...prev, image: imagePreview }));
        setImagePreview(null);
        setImageFile(null);
      }
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile.');
      setTimeout(() => setError(''), 5000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner-container">
          <div className="elegant-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="profile-error">
        <div className="error-content">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Profile Not Found</h2>
          <p>{error || 'Unable to load your profile information.'}</p>
          <button 
            className="back-to-dashboard-btn"
            onClick={() => navigate(userType === 'business' ? '/dashboard/business' : '/dashboard/individual')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>

      <div className="profile-container">
        {/* Navigation Header */}
        <header className="page-navigation">
          <button 
            className="back-button"
            onClick={() => navigate(userType === 'business' ? '/dashboard/business' : '/dashboard/individual')}
            title="Back to dashboard"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </button>
          
          <div className="page-breadcrumb">
            <span className="breadcrumb-item">Dashboard</span>
            <i className="fas fa-chevron-right"></i>
            <span className="breadcrumb-item current">Profile Settings</span>
          </div>
        </header>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-banner">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div className="current-avatar">
                  {imagePreview || form.image ? (
                    <img 
                      src={imagePreview || form.image} 
                      alt="Profile" 
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {form.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <label className="avatar-upload-btn" htmlFor="avatar-input">
                  <i className="fas fa-camera"></i>
                  <span>Change Photo</span>
                  <input 
                    type="file" 
                    id="avatar-input"
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="avatar-input"
                  />
                </label>
              </div>
              
              <div className="profile-basic-info">
                <h1 className="profile-name">
                  {userType === 'business' ? form.businessName : form.name}
                </h1>
                <div className="profile-type-badge">
                  <i className={`fas ${userType === 'business' ? 'fa-building' : 'fa-user'}`}></i>
                  {userType === 'business' ? 'Business Owner' : 'Professional'}
                </div>
                <p className="profile-subtitle">
                  {userType === 'business' ? form.businessType : form.occupation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <main className="profile-content">
          {/* Section Navigation */}
          <nav className="section-nav">
            <button 
              className={`nav-btn ${activeSection === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveSection('personal')}
            >
              <i className="fas fa-user"></i>
              Personal Information
            </button>
            <button 
              className={`nav-btn ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveSection('contact')}
            >
              <i className="fas fa-address-book"></i>
              Contact Details
            </button>
            {userType === 'business' ? (
              <button 
                className={`nav-btn ${activeSection === 'business' ? 'active' : ''}`}
                onClick={() => setActiveSection('business')}
              >
                <i className="fas fa-briefcase"></i>
                Business Information
              </button>
            ) : (
              <button 
                className={`nav-btn ${activeSection === 'professional' ? 'active' : ''}`}
                onClick={() => setActiveSection('professional')}
              >
                <i className="fas fa-certificate"></i>
                Professional Details
              </button>
            )}
          </nav>

          {/* Form Section */}
          <div className="form-section">
            <form onSubmit={handleSave} className="profile-form">
              {/* Personal Information */}
              {activeSection === 'personal' && (
                <div className="form-section-content">
                  <div className="section-header">
                    <h3>Personal Information</h3>
                    <p>Update your basic personal details</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name || ''}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="description">About Me *</label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Tell us about yourself, your expertise, and what drives you..."
                        value={form.description || ''}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="form-textarea"
                      />
                      <div className="char-counter">
                        {(form.description || '').length}/500 characters
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Details */}
              {activeSection === 'contact' && (
                <div className="form-section-content">
                  <div className="section-header">
                    <h3>Contact Details</h3>
                    <p>Keep your contact information up to date</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <div className="input-with-icon disabled">
                        <i className="fas fa-envelope"></i>
                        <input
                          type="email"
                          id="email"
                          value={form.email || ''}
                          className="form-input"
                          disabled
                        />
                        <span className="disabled-note">Cannot be changed</span>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <div className="input-with-icon">
                        <i className="fas fa-phone"></i>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="+91 98765 43210"
                          value={form.phone || ''}
                          onChange={handleChange}
                          required
                          className="form-input"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="address">Address *</label>
                      <div className="input-with-icon">
                        <i className="fas fa-map-marker-alt"></i>
                        <textarea
                          id="address"
                          name="address"
                          placeholder="Enter your complete address"
                          value={form.address || ''}
                          onChange={handleChange}
                          required
                          rows="3"
                          className="form-textarea"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business/Professional Information */}
              {((userType === 'business' && activeSection === 'business') || 
                (userType === 'individual' && activeSection === 'professional')) && (
                <div className="form-section-content">
                  <div className="section-header">
                    <h3>
                      {userType === 'business' ? 'Business Information' : 'Professional Details'}
                    </h3>
                    <p>
                      {userType === 'business' 
                        ? 'Provide details about your business'
                        : 'Share your professional background and skills'
                      }
                    </p>
                  </div>
                  
                  <div className="form-grid">
                    {userType === 'business' ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="businessName">Business Name *</label>
                          <input
                            type="text"
                            id="businessName"
                            name="businessName"
                            placeholder="Your business name"
                            value={form.businessName || ''}
                            onChange={handleChange}
                            required
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="businessType">Industry/Business Type *</label>
                          <input
                            type="text"
                            id="businessType"
                            name="businessType"
                            placeholder="e.g., Technology, Healthcare, Retail"
                            value={form.businessType || ''}
                            onChange={handleChange}
                            required
                            className="form-input"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <label htmlFor="occupation">Current Occupation *</label>
                          <input
                            type="text"
                            id="occupation"
                            name="occupation"
                            placeholder="Your job title or profession"
                            value={form.occupation || ''}
                            onChange={handleChange}
                            required
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="skills">Skills & Expertise *</label>
                          <input
                            type="text"
                            id="skills"
                            name="skills"
                            placeholder="List your key skills (comma separated)"
                            value={form.skills || ''}
                            onChange={handleChange}
                            required
                            className="form-input"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {error && (
                <div className="status-message error">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="status-message success">
                  <i className="fas fa-check-circle"></i>
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {/* Form Actions */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    // Reset form to original state
                    window.location.reload();
                  }}
                >
                  <i className="fas fa-undo"></i>
                  Reset Changes
                </button>
                
                <button 
                  type="submit" 
                  disabled={saving}
                  className={`btn-primary ${saving ? 'loading' : ''}`}
                >
                  {saving ? (
                    <>
                      <div className="loading-spinner"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
