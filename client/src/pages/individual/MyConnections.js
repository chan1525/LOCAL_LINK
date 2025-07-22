import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './MyConnections.css';

const MyConnections = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const reqSnap = await getDocs(collection(db, 'individuals', user.uid, 'connections'));
      setRequests(reqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleUpdate = async (id, status) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'individuals', user.uid, 'connections', id), { status });
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
    setUpdating(prev => ({ ...prev, [id]: false }));
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.fromName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(req => req.status === 'pending').length,
      accepted: requests.filter(req => req.status === 'accepted').length,
      rejected: requests.filter(req => req.status === 'rejected').length
    };
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="my-connections-loading">
        <div className="loading-spinner-container">
          <div className="elegant-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading your professional network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-connections-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>

      <div className="my-connections-container">
        {/* Header Section */}
        <header className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-network-wired"></i>
            </div>
            <div className="header-text">
              <h1 className="page-title">Professional Network</h1>
              <p className="page-subtitle">
                Manage your connection requests and build meaningful professional relationships
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{statusCounts.accepted}</span>
              <span className="stat-label">Connections</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{statusCounts.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </header>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="status-filters">
            {[
              { key: 'all', label: 'All', count: statusCounts.all },
              { key: 'pending', label: 'Pending', count: statusCounts.pending },
              { key: 'accepted', label: 'Connected', count: statusCounts.accepted },
              { key: 'rejected', label: 'Declined', count: statusCounts.rejected }
            ].map(filter => (
              <button
                key={filter.key}
                className={`filter-btn ${filterStatus === filter.key ? 'active' : ''}`}
                onClick={() => setFilterStatus(filter.key)}
              >
                {filter.label}
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Connections Content */}
        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <h3>
              {requests.length === 0 
                ? 'No Connection Requests Yet' 
                : 'No Connections Found'
              }
            </h3>
            <p>
              {requests.length === 0 
                ? 'Start building your professional network by connecting with other professionals'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {requests.length === 0 && (
              <button 
                className="cta-button"
                onClick={() => window.location.href = '/browse/individuals'}
              >
                <i className="fas fa-users"></i>
                Browse Professionals
              </button>
            )}
          </div>
        ) : (
          <main className="connections-list">
            {filteredRequests.map((request, index) => (
              <article 
                key={request.id} 
                className="connection-card"
                style={{ '--animation-delay': `${index * 0.1}s` }}
              >
                {/* Connection Header */}
                <div className="connection-header">
                  <div className="connection-info">
                    <div className="connection-avatar">
                      {request.fromName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="connection-details">
                      <h3 className="connection-name">{request.fromName}</h3>
                      <div className="connection-meta">
                        <span className="connection-date">
                          <i className="fas fa-calendar-alt"></i>
                          {formatDate(request.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`status-badge ${request.status}`}>
                    {request.status === 'pending' && <i className="fas fa-clock"></i>}
                    {request.status === 'accepted' && <i className="fas fa-check-circle"></i>}
                    {request.status === 'rejected' && <i className="fas fa-times-circle"></i>}
                    <span>
                      {request.status === 'pending' ? 'Pending' : 
                       request.status === 'accepted' ? 'Connected' : 'Declined'}
                    </span>
                  </div>
                </div>

                {/* Connection Content */}
                <div className="connection-content">
                  <p className="connection-message">
                    {request.status === 'pending' 
                      ? 'Would like to connect with you on your professional network'
                      : request.status === 'accepted'
                      ? 'You are now connected! You can message each other and collaborate.'
                      : 'Connection request was declined'
                    }
                  </p>
                </div>

                {/* Connection Actions */}
                {request.status === 'pending' && (
                  <div className="connection-actions">
                    <button
                      onClick={() => handleUpdate(request.id, 'rejected')}
                      disabled={updating[request.id]}
                      className="action-btn decline-btn"
                    >
                      {updating[request.id] ? (
                        <div className="mini-spinner"></div>
                      ) : (
                        <i className="fas fa-times"></i>
                      )}
                      Decline
                    </button>
                    
                    <button
                      onClick={() => handleUpdate(request.id, 'accepted')}
                      disabled={updating[request.id]}
                      className="action-btn accept-btn"
                    >
                      {updating[request.id] ? (
                        <div className="mini-spinner"></div>
                      ) : (
                        <i className="fas fa-check"></i>
                      )}
                      Accept
                    </button>
                  </div>
                )}

                {request.status === 'accepted' && (
                  <div className="connection-actions">
                    <button className="action-btn message-btn">
                      <i className="fas fa-envelope"></i>
                      Message
                    </button>
                    <button className="action-btn profile-btn">
                      <i className="fas fa-user"></i>
                      View Profile
                    </button>
                  </div>
                )}
              </article>
            ))}
          </main>
        )}

        {/* Network Insights */}
        {requests.length > 0 && (
          <aside className="network-insights">
            <div className="insights-card">
              <div className="insights-header">
                <h3>
                  <i className="fas fa-chart-network"></i>
                  Network Insights
                </h3>
              </div>
              <div className="insights-content">
                <div className="insight-item">
                  <div className="insight-icon">
                    <i className="fas fa-trending-up"></i>
                  </div>
                  <div className="insight-text">
                    <span className="insight-title">Network Growth</span>
                    <span className="insight-description">
                      Your professional network has grown by {statusCounts.accepted} connections
                    </span>
                  </div>
                </div>
                
                {statusCounts.pending > 0 && (
                  <div className="insight-item">
                    <div className="insight-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="insight-text">
                      <span className="insight-title">Pending Requests</span>
                      <span className="insight-description">
                        You have {statusCounts.pending} connection request{statusCounts.pending !== 1 ? 's' : ''} waiting for your response
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="insight-item">
                  <div className="insight-icon">
                    <i className="fas fa-handshake"></i>
                  </div>
                  <div className="insight-text">
                    <span className="insight-title">Professional Reach</span>
                    <span className="insight-description">
                      Expand your network by connecting with more professionals in your field
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default MyConnections;
