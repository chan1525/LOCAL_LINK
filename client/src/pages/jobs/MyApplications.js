import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import MessageModal from '../../components/MessageModal';
import './MyApplications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchApplications = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const jobsSnap = await getDocs(collection(db, 'jobs'));
      const apps = [];
      for (const jobDoc of jobsSnap.docs) {
        const appSnap = await getDoc(doc(db, 'jobs', jobDoc.id, 'applications', user.uid));
        if (appSnap.exists()) {
          apps.push({
            jobId: jobDoc.id,
            job: jobDoc.data(),
            application: appSnap.data(),
            applicantId: user.uid,
            applicantName: appSnap.data().userName
          });
        }
      }
      setApplications(apps);
      setLoading(false);
    };
    fetchApplications();
  }, []);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const now = new Date();
    const postTime = timestamp.toDate();
    const diff = now - postTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    return 'Just applied';
  };

  const getApplicationStatus = (application) => {
    // This would be determined by your business logic
    // For now, we'll show basic statuses
    const daysSinceApplication = Math.floor((new Date() - application.appliedAt?.toDate()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceApplication < 1) return { status: 'submitted', label: 'Application Submitted' };
    if (daysSinceApplication < 7) return { status: 'under-review', label: 'Under Review' };
    return { status: 'pending', label: 'Pending Response' };
  };

  const sortedApplications = [...applications].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (b.application.appliedAt?.toDate() || 0) - (a.application.appliedAt?.toDate() || 0);
      case 'oldest':
        return (a.application.appliedAt?.toDate() || 0) - (b.application.appliedAt?.toDate() || 0);
      case 'company':
        return (a.job.businessName || '').localeCompare(b.job.businessName || '');
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="my-applications-loading">
        <div className="loading-spinner-container">
          <div className="elegant-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-applications-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>

      <div className="my-applications-container">
        {/* Header Section */}
        <header className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="header-text">
              <h1 className="page-title">My Job Applications</h1>
              <p className="page-subtitle">
                Track your job applications and manage communications with potential employers
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{applications.length}</span>
              <span className="stat-label">Total Applications</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {applications.filter(app => {
                  const status = getApplicationStatus(app.application);
                  return status.status === 'under-review';
                }).length}
              </span>
              <span className="stat-label">Under Review</span>
            </div>
          </div>
        </header>

        {/* Control Bar */}
        <div className="control-bar">
          <div className="control-left">
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="company">Company Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Content */}
        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-inbox"></i>
            </div>
            <h3>No Applications Yet</h3>
            <p>Start your job search by browsing available opportunities and applying to positions that match your skills</p>
            <button 
              className="cta-button"
              onClick={() => window.location.href = '/jobs'}
            >
              <i className="fas fa-search"></i>
              Browse Job Opportunities
            </button>
          </div>
        ) : (
          <main className="applications-grid">
            {sortedApplications.map((app, index) => {
              const applicationStatus = getApplicationStatus(app.application);
              
              return (
                <article 
                  key={app.jobId} 
                  className="application-card"
                  style={{ '--animation-delay': `${index * 0.1}s` }}
                >
                  {/* Application Header */}
                  <div className="application-header">
                    <div className="job-info">
                      <div className="company-avatar">
                        {app.job.businessName?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div className="job-details">
                        <h3 className="job-title">{app.job.title}</h3>
                        <p className="company-name">{app.job.businessName}</p>
                      </div>
                    </div>
                    
                    <div className={`status-badge ${applicationStatus.status}`}>
                      {applicationStatus.label}
                    </div>
                  </div>

                  {/* Application Content */}
                  <div className="application-content">
                    <div className="job-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{app.job.location}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Salary:</span>
                        <span className="detail-value salary">{app.job.salary}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Applied:</span>
                        <span className="detail-value">{formatTimeAgo(app.application.appliedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="job-description">
                      <p>{app.job.description}</p>
                    </div>
                    
                    <div className="job-requirements">
                      <h5>Requirements:</h5>
                      <p>{app.job.requirements}</p>
                    </div>
                  </div>

                  {/* Application Actions */}
                  <div className="application-actions">
                    <button 
                      className="action-btn secondary"
                      onClick={() => {/* Handle view job details */}}
                    >
                      <i className="fas fa-eye"></i>
                      View Job
                    </button>
                    
                    <button
                      className="action-btn primary"
                      onClick={() => setModal({ 
                        jobId: app.jobId, 
                        applicantId: app.applicantId, 
                        applicantName: app.applicantName 
                      })}
                    >
                      <i className="fas fa-comment"></i>
                      Message Employer
                    </button>
                  </div>

                  {/* Application Timeline */}
                  <div className="application-timeline">
                    <div className="timeline-item completed">
                      <div className="timeline-icon">
                        <i className="fas fa-check"></i>
                      </div>
                      <div className="timeline-content">
                        <span className="timeline-title">Application Submitted</span>
                        <span className="timeline-date">{formatTimeAgo(app.application.appliedAt)}</span>
                      </div>
                    </div>
                    
                    <div className={`timeline-item ${applicationStatus.status === 'under-review' ? 'active' : ''}`}>
                      <div className="timeline-icon">
                        <i className="fas fa-eye"></i>
                      </div>
                      <div className="timeline-content">
                        <span className="timeline-title">Under Review</span>
                        <span className="timeline-date">Pending</span>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-icon">
                        <i className="fas fa-user-tie"></i>
                      </div>
                      <div className="timeline-content">
                        <span className="timeline-title">Interview</span>
                        <span className="timeline-date">Waiting</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </main>
        )}

        {/* Message Modal */}
        {modal && (
          <MessageModal
            jobId={modal.jobId}
            applicantId={modal.applicantId}
            applicantName={modal.applicantName}
            onClose={() => setModal(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MyApplications;
