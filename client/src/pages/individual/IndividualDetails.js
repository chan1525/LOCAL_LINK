import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import './IndividualDetails.css';

const IndividualDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [individual, setIndividual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchIndividual = async () => {
      const docRef = doc(db, 'individuals', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIndividual(docSnap.data());
      }
      setLoading(false);
    };
    fetchIndividual();
  }, [id]);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (!currentUser || !id || currentUser.uid === id) return;
      
      const reqRef = doc(db, 'individuals', id, 'connections', currentUser.uid);
      const reqSnap = await getDoc(reqRef);
      if (reqSnap.exists()) {
        setConnectionStatus(reqSnap.data().status);
      }
    };
    checkConnectionStatus();
  }, [currentUser, id]);

  const handleConnect = async () => {
    if (!currentUser || currentUser.uid === id) return;
    
    setConnecting(true);
    
    let userName = currentUser.displayName || 'User';
    const indSnap = await getDoc(doc(db, 'individuals', currentUser.uid));
    if (indSnap.exists()) userName = indSnap.data().name;
    
    await setDoc(doc(db, 'individuals', id, 'connections', currentUser.uid), {
      fromUid: currentUser.uid,
      fromName: userName,
      status: 'pending',
      createdAt: new Date()
    });
    
    setConnectionStatus('pending');
    setConnecting(false);
  };

  if (loading) {
    return (
      <div className="individual-details-loading">
        <div className="loading-spinner-container">
          <div className="elegant-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading professional profile...</p>
        </div>
      </div>
    );
  }

  if (!individual) {
    return (
      <div className="individual-not-found">
        <div className="not-found-content">
          <div className="not-found-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Professional Not Found</h2>
          <p>The profile you're looking for doesn't exist or has been removed.</p>
          <button 
            className="back-to-browse-btn"
            onClick={() => navigate('/browse/individuals')}
          >
            <i className="fas fa-arrow-left"></i>
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="individual-details-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>

      <div className="individual-details-container">
        {/* Navigation Header */}
        <header className="page-navigation">
          <button 
            className="back-button"
            onClick={() => navigate('/browse/individuals')}
            title="Back to professionals directory"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Directory</span>
          </button>
          
          <div className="page-breadcrumb">
            <span className="breadcrumb-item">Directory</span>
            <i className="fas fa-chevron-right"></i>
            <span className="breadcrumb-item">Professionals</span>
            <i className="fas fa-chevron-right"></i>
            <span className="breadcrumb-item current">{individual.name}</span>
          </div>
        </header>

        {/* Professional Profile */}
        <main className="professional-profile">
          {/* Cover Section */}
          <div className="professional-cover">
            <div className="cover-background">
              {individual.image && (
                <div 
                  className="cover-image"
                  style={{ backgroundImage: `url(${individual.image})` }}
                ></div>
              )}
              <div className="cover-overlay"></div>
            </div>
            
            <div className="professional-hero">
              <div className="professional-avatar-section">
                <div className="professional-avatar">
                  {individual.image ? (
                    <img src={individual.image} alt={individual.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {individual.name?.charAt(0).toUpperCase() || 'P'}
                    </div>
                  )}
                </div>
                <div className="professional-basic-info">
                  <h1 className="professional-name">{individual.name}</h1>
                  <div className="professional-occupation-badge">
                    <i className="fas fa-briefcase"></i>
                    {individual.occupation}
                  </div>
                </div>
              </div>
              
              <div className="professional-actions">
                <button className="action-btn message-btn">
                  <i className="fas fa-envelope"></i>
                  Message
                </button>
                
                {currentUser && individual.id !== currentUser?.uid && (
                  <button 
                    className={`action-btn connect-btn ${
                      connectionStatus === 'accepted' ? 'connected' : 
                      connectionStatus === 'pending' ? 'pending' : ''
                    }`}
                    onClick={handleConnect}
                    disabled={connecting || connectionStatus === 'pending' || connectionStatus === 'accepted'}
                  >
                    {connectionStatus === 'pending' ? (
                      <>
                        <i className="fas fa-clock"></i>
                        Request Sent
                      </>
                    ) : connectionStatus === 'accepted' ? (
                      <>
                        <i className="fas fa-check"></i>
                        Connected
                      </>
                    ) : connecting ? (
                      <>
                        <div className="mini-spinner"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i>
                        Connect
                      </>
                    )}
                  </button>
                )}
                
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
                    <i className="fas fa-user"></i>
                    About
                  </h3>
                </div>
                <div className="card-content">
                  <p className="professional-description">
                    {individual.description || 'No description available for this professional.'}
                  </p>
                </div>
              </div>

              {/* Skills Section */}
              {individual.skills && (
                <div className="info-card">
                  <div className="card-header">
                    <h3>
                      <i className="fas fa-tools"></i>
                      Skills & Expertise
                    </h3>
                  </div>
                  <div className="card-content">
                    <div className="skills-cloud">
                      {individual.skills.split(',').map((skill, index) => (
                        <span key={index} className="skill-chip">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
                    {individual.email && (
                      <div className="contact-item">
                        <div className="contact-icon">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <div className="contact-details">
                          <span className="contact-label">Email</span>
                          <a 
                            href={`mailto:${individual.email}`}
                            className="contact-value"
                          >
                            {individual.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {individual.phone && (
                      <div className="contact-item">
                        <div className="contact-icon">
                          <i className="fas fa-phone"></i>
                        </div>
                        <div className="contact-details">
                          <span className="contact-label">Phone</span>
                          <a 
                            href={`tel:${individual.phone}`}
                            className="contact-value"
                          >
                            {individual.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {individual.address && (
                      <div className="contact-item">
                        <div className="contact-icon">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div className="contact-details">
                          <span className="contact-label">Location</span>
                          <span className="contact-value">{individual.address}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Sidebar */}
            <aside className="sidebar-content">
              {/* Professional Stats */}
              <div className="info-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-chart-bar"></i>
                    Professional Insights
                  </h3>
                </div>
                <div className="card-content">
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-number">3+</div>
                      <div className="stat-label">Years Experience</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">50+</div>
                      <div className="stat-label">Projects</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">4.9</div>
                      <div className="stat-label">Rating</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">24h</div>
                      <div className="stat-label">Response Time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Status */}
              <div className="info-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-signal"></i>
                    Activity Status
                  </h3>
                </div>
                <div className="card-content">
                  <div className="activity-status">
                    <div className="status-indicator online"></div>
                    <div className="status-text">
                      <span className="status-label">Available for opportunities</span>
                      <span className="status-time">Last active 2 hours ago</span>
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
                      <i className="fas fa-handshake"></i>
                      <span>Collaborate</span>
                    </button>
                    <button className="quick-action-btn">
                      <i className="fas fa-star"></i>
                      <span>Endorse Skills</span>
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

export default IndividualDetails;
