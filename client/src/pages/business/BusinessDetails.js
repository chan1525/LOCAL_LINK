import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import './BusinessDetails.css';

const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      const docRef = doc(db, 'business_owners', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBusiness(docSnap.data());
      }
      setLoading(false);
    };
    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="business-details-loading">
        <div className="loading-spinner-container">
          <div className="elegant-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading business profile...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="business-not-found">
        <div className="not-found-content">
          <div className="not-found-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Business Not Found</h2>
          <p>The business profile you're looking for doesn't exist or has been removed.</p>
          <button 
            className="back-to-browse-btn"
            onClick={() => navigate('/browse/business')}
          >
            <i className="fas fa-arrow-left"></i>
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="business-details-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>

      <div className="business-details-container">
        {/* Navigation Header */}
        <header className="page-navigation">
          <button 
            className="back-button"
            onClick={() => navigate('/browse/business')}
            title="Back to business directory"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Directory</span>
          </button>
          
          <div className="page-breadcrumb">
            <span className="breadcrumb-item">Directory</span>
            <i className="fas fa-chevron-right"></i>
            <span className="breadcrumb-item">Businesses</span>
            <i className="fas fa-chevron-right"></i>
            <span className="breadcrumb-item current">{business.businessName}</span>
          </div>
        </header>

        {/* Business Profile */}
        <main className="business-profile">
          {/* Cover Section */}
          <div className="business-cover">
            <div className="cover-background">
              {business.image && (
                <div 
                  className="cover-image"
                  style={{ backgroundImage: `url(${business.image})` }}
                ></div>
              )}
              <div className="cover-overlay"></div>
            </div>
            
            <div className="business-hero">
              <div className="business-avatar-section">
                <div className="business-avatar">
                  {business.image ? (
                    <img src={business.image} alt={business.businessName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {business.businessName?.charAt(0).toUpperCase() || 'B'}
                    </div>
                  )}
                </div>
                <div className="business-basic-info">
                  <h1 className="business-name">{business.businessName}</h1>
                  <div className="business-type-badge">
                    <i className="fas fa-tag"></i>
                    {business.businessType}
                  </div>
                </div>
              </div>
              
              <div className="business-actions">
                <button className="action-btn connect-btn">
                  <i className="fas fa-handshake"></i>
                  Connect
                </button>
                <button className="action-btn message-btn">
                  <i className="fas fa-envelope"></i>
                  Message
                </button>
                <button className="action-btn share-btn">
                  <i className="fas fa-share-alt"></i>
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Main Information */}
            <section className="main-content">
              {/* About Section */}
              <div className="info-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-info-circle"></i>
                    About Our Business
                  </h3>
                </div>
                <div className="card-content">
                  <p className="business-description">
                    {business.description || 'No description available for this business.'}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="info-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-address-book"></i>
                    Contact Information
                  </h3>
                </div>
                <div className="card-content">
                  <div className="contact-grid">
                    {business.email && (
                      <div className="contact-item">
                        <div className="contact-icon">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <div className="contact-details">
                          <span className="contact-label">Email</span>
                          <a 
                            href={`mailto:${business.email}`}
                            className="contact-value"
                          >
                            {business.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {business.phone && (
                      <div className="contact-item">
                        <div className="contact-icon">
                          <i className="fas fa-phone"></i>
                        </div>
                        <div className="contact-details">
                          <span className="contact-label">Phone</span>
                          <a 
                            href={`tel:${business.phone}`}
                            className="contact-value"
                          >
                            {business.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {business.address && (
                      <div className="contact-item">
                        <div className="contact-icon">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div className="contact-details">
                          <span className="contact-label">Address</span>
                          <span className="contact-value">{business.address}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Sidebar */}
            <aside className="sidebar-content">
              {/* Owner Information */}
              <div className="info-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-user-tie"></i>
                    Business Owner
                  </h3>
                </div>
                <div className="card-content">
                  <div className="owner-profile">
                    <div className="owner-avatar">
                      {business.name?.charAt(0).toUpperCase() || 'O'}
                    </div>
                    <div className="owner-info">
                      <h4 className="owner-name">{business.name}</h4>
                      <p className="owner-title">Business Owner & Founder</p>
                    </div>
                  </div>
                  <div className="owner-actions">
                    <button className="owner-action-btn">
                      <i className="fas fa-user-plus"></i>
                      Connect
                    </button>
                    <button className="owner-action-btn">
                      <i className="fas fa-comment"></i>
                      Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Business Stats */}
              <div className="info-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-chart-bar"></i>
                    Business Insights
                  </h3>
                </div>
                <div className="card-content">
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-number">5+</div>
                      <div className="stat-label">Years Active</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">150+</div>
                      <div className="stat-label">Clients Served</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">4.8</div>
                      <div className="stat-label">Rating</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">24/7</div>
                      <div className="stat-label">Support</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="info-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-rocket"></i>
                    Quick Actions
                  </h3>
                </div>
                <div className="card-content">
                  <div className="quick-actions-grid">
                    <button className="quick-action-btn">
                      <i className="fas fa-briefcase"></i>
                      <span>View Jobs</span>
                    </button>
                    <button className="quick-action-btn">
                      <i className="fas fa-star"></i>
                      <span>Save Business</span>
                    </button>
                    <button className="quick-action-btn">
                      <i className="fas fa-flag"></i>
                      <span>Report</span>
                    </button>
                    <button className="quick-action-btn">
                      <i className="fas fa-share"></i>
                      <span>Share Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessDetails;
