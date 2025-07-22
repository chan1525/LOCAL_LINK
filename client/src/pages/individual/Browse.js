import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './BrowseIndividuals.css';

const BrowseIndividuals = () => {
  const [individuals, setIndividuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState({});
  const [connectionStatus, setConnectionStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchIndividuals = async () => {
      const querySnapshot = await getDocs(collection(db, 'individuals'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIndividuals(data);
      setLoading(false);
    };
    fetchIndividuals();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!currentUser) return;
      const status = {};
      for (const individual of individuals) {
        if (individual.id === currentUser.uid) continue;
        const reqRef = doc(db, 'individuals', individual.id, 'connections', currentUser.uid);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          status[individual.id] = reqSnap.data().status;
        }
      }
      setConnectionStatus(status);
    };
    if (individuals.length && currentUser) fetchStatus();
  }, [individuals, currentUser]);

  const handleConnect = async (individual) => {
    setConnecting(prev => ({ ...prev, [individual.id]: true }));
    const user = auth.currentUser;
    if (!user) return;
    if (user.uid === individual.id) return;
    
    let userName = user.displayName || 'User';
    const indSnap = await getDoc(doc(db, 'individuals', user.uid));
    if (indSnap.exists()) userName = indSnap.data().name;
    
    await setDoc(doc(db, 'individuals', individual.id, 'connections', user.uid), {
      fromUid: user.uid,
      fromName: userName,
      status: 'pending',
      createdAt: new Date()
    });
    setConnectionStatus(prev => ({ ...prev, [individual.id]: 'pending' }));
    setConnecting(prev => ({ ...prev, [individual.id]: false }));
  };

  const filteredAndSortedIndividuals = individuals
    .filter(individual => {
      if (currentUser && individual.id === currentUser.uid) return false;
      
      const matchesSearch = 
        individual.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        individual.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        individual.skills?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSkill = filterSkill === 'all' || 
        individual.skills?.toLowerCase().includes(filterSkill.toLowerCase());
      
      return matchesSearch && matchesSkill;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'occupation':
          return (a.occupation || '').localeCompare(b.occupation || '');
        default:
          return 0;
      }
    });

  const skills = [...new Set(
    individuals
      .flatMap(ind => ind.skills?.split(',').map(skill => skill.trim()) || [])
      .filter(Boolean)
  )];

  if (loading) {
    return (
      <div className="browse-individuals-loading">
        <div className="loading-spinner-container">
          <div className="elegant-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Discovering professional talent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-individuals-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="browse-individuals-container">
        {/* Header Section */}
        <header className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="header-text">
              <h1 className="page-title">Professional Network Directory</h1>
              <p className="page-subtitle">
                Connect with talented professionals and expand your network
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{individuals.length}</span>
              <span className="stat-label">Professionals</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{skills.length}</span>
              <span className="stat-label">Skills</span>
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
                placeholder="Search professionals, skills, or occupations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="skill-filter">Skills:</label>
              <select 
                id="skill-filter"
                value={filterSkill} 
                onChange={(e) => setFilterSkill(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Skills</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
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
                <option value="name">Name</option>
                <option value="occupation">Occupation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <span className="results-count">
            {filteredAndSortedIndividuals.length} professional{filteredAndSortedIndividuals.length !== 1 ? 's' : ''} found
          </span>
          {(searchTerm || filterSkill !== 'all') && (
            <button 
              className="clear-filters"
              onClick={() => {
                setSearchTerm('');
                setFilterSkill('all');
              }}
            >
              <i className="fas fa-times"></i>
              Clear filters
            </button>
          )}
        </div>

        {/* Professionals Grid */}
        {filteredAndSortedIndividuals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <h3>No professionals found</h3>
            <p>Try adjusting your search criteria or browse all professionals</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setFilterSkill('all');
              }}
            >
              Show All Professionals
            </button>
          </div>
        ) : (
          <main className="professionals-grid">
            {filteredAndSortedIndividuals.map((individual, index) => (
              <article 
                key={individual.id} 
                className="professional-card"
                onClick={() => navigate(`/individual/${individual.id}`)}
                style={{ '--animation-delay': `${index * 0.1}s` }}
              >
                {/* Professional Image */}
                <div className="professional-image-container">
                  {individual.image ? (
                    <img 
                      src={individual.image} 
                      alt={individual.name} 
                      className="professional-image"
                    />
                  ) : (
                    <div className="professional-placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                  <div className="professional-overlay">
                    <button className="view-profile-btn">
                      <i className="fas fa-eye"></i>
                      View Profile
                    </button>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="professional-info">
                  <div className="professional-header">
                    <h3 className="professional-name">{individual.name}</h3>
                    <div className="professional-occupation">
                      {individual.occupation}
                    </div>
                  </div>
                  
                  {individual.skills && (
                    <div className="skills-section">
                      <h5>Skills</h5>
                      <div className="skills-tags">
                        {individual.skills.split(',').slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="skill-tag">
                            {skill.trim()}
                          </span>
                        ))}
                        {individual.skills.split(',').length > 3 && (
                          <span className="skill-tag more">
                            +{individual.skills.split(',').length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {individual.description && (
                    <p className="professional-description">
                      {individual.description.length > 100 
                        ? `${individual.description.substring(0, 100)}...`
                        : individual.description
                      }
                    </p>
                  )}

                  <div className="professional-details">
                    {individual.address && (
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{individual.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Actions */}
                <div className="professional-actions">
                  <button 
                    className="action-btn message-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle message logic
                    }}
                  >
                    <i className="fas fa-envelope"></i>
                    Message
                  </button>
                  
                  {currentUser && individual.id !== currentUser.uid && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnect(individual);
                      }}
                      disabled={connecting[individual.id] || connectionStatus[individual.id] === 'pending' || connectionStatus[individual.id] === 'accepted'}
                      className={`action-btn connect-btn ${
                        connectionStatus[individual.id] === 'accepted' ? 'connected' : 
                        connectionStatus[individual.id] === 'pending' ? 'pending' : ''
                      }`}
                    >
                      {connectionStatus[individual.id] === 'pending' ? (
                        <>
                          <i className="fas fa-clock"></i>
                          Request Sent
                        </>
                      ) : connectionStatus[individual.id] === 'accepted' ? (
                        <>
                          <i className="fas fa-check"></i>
                          Connected
                        </>
                      ) : connecting[individual.id] ? (
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
                </div>
              </article>
            ))}
          </main>
        )}
      </div>
    </div>
  );
};

export default BrowseIndividuals;
