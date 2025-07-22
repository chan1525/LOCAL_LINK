import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  addDoc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import './JobsFeed.css';

const JobsFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const applied = [];
      for (const job of jobs) {
        const appRef = doc(db, 'jobs', job.id, 'applications', user.uid);
        const appSnap = await getDoc(appRef);
        if (appSnap.exists()) {
          applied.push(job.id);
        }
      }
      setAppliedJobs(applied);
    };
    if (jobs.length && auth.currentUser) fetchAppliedJobs();
  }, [jobs]);

  const handleApply = async (job) => {
    setApplying(prev => ({ ...prev, [job.id]: true }));
    const user = auth.currentUser;
    if (!user) return;
    
    let userName = user.displayName || 'User';
    const indSnap = await getDoc(doc(db, 'individuals', user.uid));
    if (indSnap.exists()) userName = indSnap.data().name;
    
    await setDoc(doc(db, 'jobs', job.id, 'applications', user.uid), {
      uid: user.uid,
      userName,
      appliedAt: serverTimestamp()
    });
    setAppliedJobs(prev => [...prev, job.id]);
    setApplying(prev => ({ ...prev, [job.id]: false }));
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

  const filteredAndSortedJobs = jobs
    .filter(job => {
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = filterLocation === 'all' || 
        job.location?.toLowerCase().includes(filterLocation.toLowerCase());
      
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0);
        case 'oldest':
          return (a.createdAt?.toDate() || 0) - (b.createdAt?.toDate() || 0);
        case 'company':
          return (a.businessName || '').localeCompare(b.businessName || '');
        default:
          return 0;
      }
    });

  const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))];

  if (loading) {
    return (
      <div className="jobs-feed-loading">
        <div className="loading-spinner-container">
          <div className="elegant-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading career opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-feed-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>

      <div className="jobs-feed-container">
        {/* Header Section */}
        <header className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="header-text">
              <h1 className="page-title">Career Opportunities</h1>
              <p className="page-subtitle">
                Discover your next career move with opportunities from leading companies
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{jobs.length}</span>
              <span className="stat-label">Open Positions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{appliedJobs.length}</span>
              <span className="stat-label">Applied</span>
            </div>
          </div>
        </header>

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="location-filter">Location:</label>
              <select 
                id="location-filter"
                value={filterLocation} 
                onChange={(e) => setFilterLocation(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="company">Company Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <span className="results-count">
            {filteredAndSortedJobs.length} opportunity{filteredAndSortedJobs.length !== 1 ? 'ies' : 'y'} found
          </span>
        </div>

        {/* Jobs Grid */}
        {filteredAndSortedJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No opportunities found</h3>
            <p>Try adjusting your search criteria or check back later for new postings</p>
          </div>
        ) : (
          <main className="jobs-grid">
            {filteredAndSortedJobs.map((job, index) => (
              <article 
                key={job.id} 
                className="job-card"
                style={{ '--animation-delay': `${index * 0.1}s` }}
              >
                {/* Job Header */}
                <div className="job-header">
                  <div className="job-title-section">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="company-info">
                      <div className="company-avatar">
                        {job.businessName?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div className="company-details">
                        <span className="company-name">{job.businessName}</span>
                        <span className="job-posted">{formatTimeAgo(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="job-bookmark">
                    <button className="bookmark-btn" title="Save job">
                      <i className="far fa-bookmark"></i>
                    </button>
                  </div>
                </div>

                {/* Job Details */}
                <div className="job-details">
                  <div className="detail-tags">
                    <div className="detail-tag location">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{job.location}</span>
                    </div>
                    <div className="detail-tag salary">
                      <i className="fas fa-rupee-sign"></i>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="job-description">
                  <p>{job.description}</p>
                </div>

                {/* Job Requirements */}
                <div className="job-requirements">
                  <h5>Key Requirements:</h5>
                  <p>{job.requirements}</p>
                </div>

                {/* Job Actions */}
                <div className="job-actions">
                  <button 
                    className="action-btn secondary"
                    onClick={() => {/* Handle view details */}}
                  >
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  
                  <button
                    onClick={() => handleApply(job)}
                    disabled={appliedJobs.includes(job.id) || applying[job.id]}
                    className={`action-btn primary ${
                      appliedJobs.includes(job.id) ? 'applied' : applying[job.id] ? 'loading' : ''
                    }`}
                  >
                    {applying[job.id] ? (
                      <>
                        <div className="mini-spinner"></div>
                        Applying...
                      </>
                    ) : appliedJobs.includes(job.id) ? (
                      <>
                        <i className="fas fa-check"></i>
                        Applied
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Apply Now
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </main>
        )}
      </div>
    </div>
  );
};

export default JobsFeed;
