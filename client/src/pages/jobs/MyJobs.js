import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import MessageModal from '../../components/MessageModal';
import './MyJobs.css';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState({});
  const [deleting, setDeleting] = useState({});
  const [modal, setModal] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchBusinessData = async () => {
      const user = auth.currentUser;
      if (user) {
        const businessSnap = await getDoc(doc(db, 'business_owners', user.uid));
        if (businessSnap.exists()) {
          setBusinessData(businessSnap.data());
        }
      }
    };
    fetchBusinessData();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const myJobs = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(job => job.uid === user.uid);
      setJobs(myJobs);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      const apps = {};
      for (const job of jobs) {
        const appsSnap = await getDocs(collection(db, 'jobs', job.id, 'applications'));
        apps[job.id] = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      setApplications(apps);
    };
    if (jobs.length) fetchApplications();
  }, [jobs]);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job and all its applications?')) return;
    setDeleting(prev => ({ ...prev, [jobId]: true }));
    
    const appsSnap = await getDocs(collection(db, 'jobs', jobId, 'applications'));
    for (const appDoc of appsSnap.docs) {
      await deleteDoc(doc(db, 'jobs', jobId, 'applications', appDoc.id));
    }
    
    await deleteDoc(doc(db, 'jobs', jobId));
    setJobs(prev => prev.filter(job => job.id !== jobId));
    setDeleting(prev => ({ ...prev, [jobId]: false }));
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const now = new Date();
    const postTime = timestamp.toDate();
    const diff = now - postTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    return 'Just posted';
  };

  const getTotalApplications = () => {
    return Object.values(applications).reduce((total, jobApps) => total + jobApps.length, 0);
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0);
      case 'oldest':
        return (a.createdAt?.toDate() || 0) - (b.createdAt?.toDate() || 0);
      case 'applications':
        return (applications[b.id]?.length || 0) - (applications[a.id]?.length || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="my-jobs-loading">
        <div className="loading-spinner-container">
          <div className="elegant-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading your job listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-jobs-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>

      <div className="my-jobs-container">
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="company-avatar">
                {businessData?.image ? (
                  <img src={businessData.image} alt="Company logo" />
                ) : (
                  <div className="avatar-placeholder">
                    {businessData?.businessName?.charAt(0).toUpperCase() || 'C'}
                  </div>
                )}
              </div>
              <div className="header-text">
                <h1 className="page-title">Job Management Center</h1>
                <p className="page-subtitle">
                  Manage your job listings and review applications from qualified candidates
                </p>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-card">
                <div className="stat-number">{jobs.length}</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{getTotalApplications()}</div>
                <div className="stat-label">Applications</div>
              </div>
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
                <option value="applications">Most Applications</option>
              </select>
            </div>
          </div>
          <div className="control-right">
            <button 
              className="create-job-btn"
              onClick={() => window.location.href = '/post-job'}
            >
              <i className="fas fa-plus"></i>
              Post New Job
            </button>
          </div>
        </div>

        {/* Jobs Content */}
        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <h3>No Job Listings Yet</h3>
            <p>Start building your team by posting your first job opportunity</p>
            <button 
              className="cta-button"
              onClick={() => window.location.href = '/post-job'}
            >
              <i className="fas fa-plus-circle"></i>
              Post Your First Job
            </button>
          </div>
        ) : (
          <main className="jobs-grid">
            {sortedJobs.map((job, index) => (
              <article 
                key={job.id} 
                className="job-card"
                style={{ '--animation-delay': `${index * 0.1}s` }}
              >
                {/* Job Header */}
                <div className="job-header">
                  <div className="job-title-section">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-meta">
                      <span className="job-location">
                        <i className="fas fa-map-marker-alt"></i>
                        {job.location}
                      </span>
                      <span className="job-time">{formatTimeAgo(job.createdAt)}</span>
                    </div>
                  </div>
                  <div className="job-actions">
                    <button 
                      className="action-btn edit-btn"
                      title="Edit job"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(job.id)}
                      disabled={deleting[job.id]}
                      title="Delete job"
                    >
                      {deleting[job.id] ? (
                        <div className="mini-spinner"></div>
                      ) : (
                        <i className="fas fa-trash"></i>
                      )}
                    </button>
                  </div>
                </div>

                {/* Job Content */}
                <div className="job-content">
                  <div className="job-details">
                    <div className="detail-row">
                      <span className="detail-label">Salary:</span>
                      <span className="detail-value salary">{job.salary}</span>
                    </div>
                  </div>
                  
                  <div className="job-description">
                    <p>{job.description}</p>
                  </div>
                  
                  <div className="job-requirements">
                    <h5>Requirements:</h5>
                    <p>{job.requirements}</p>
                  </div>
                </div>

                {/* Applications Section */}
                <div className="applications-section">
                  <div className="applications-header">
                    <h4>
                      <i className="fas fa-users"></i>
                      Applications ({(applications[job.id] || []).length})
                    </h4>
                  </div>
                  
                  <div className="applications-list">
                    {(applications[job.id] || []).length === 0 ? (
                      <div className="no-applications">
                        <i className="fas fa-inbox"></i>
                        <span>No applications yet</span>
                      </div>
                    ) : (
                      <div className="applicants-grid">
                        {(applications[job.id] || []).slice(0, 3).map(app => (
                          <div key={app.id} className="applicant-card">
                            <div className="applicant-info">
                              <div className="applicant-avatar">
                                {app.userName?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div className="applicant-details">
                                <span className="applicant-name">{app.userName}</span>
                                <span className="applied-time">
                                  {formatTimeAgo(app.appliedAt)}
                                </span>
                              </div>
                            </div>
                            <button
                              className="message-btn"
                              onClick={() => setModal({ 
                                jobId: job.id, 
                                applicantId: app.id, 
                                applicantName: app.userName 
                              })}
                            >
                              <i className="fas fa-comment"></i>
                            </button>
                          </div>
                        ))}
                        
                        {(applications[job.id] || []).length > 3 && (
                          <div className="view-more-applicants">
                            <button className="view-more-btn">
                              +{(applications[job.id] || []).length - 3} more
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Footer */}
                <div className="job-footer">
                  <div className="job-stats">
                    <div className="stat-item">
                      <i className="fas fa-eye"></i>
                      <span>124 views</span>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-heart"></i>
                      <span>18 saves</span>
                    </div>
                  </div>
                  <div className="job-status">
                    <span className="status-badge active">Active</span>
                  </div>
                </div>
              </article>
            ))}
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

export default MyJobs;
