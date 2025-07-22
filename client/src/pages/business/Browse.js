import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './BrowseBusiness.css';

const BrowseBusiness = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      const querySnapshot = await getDocs(collection(db, 'business_owners'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBusinesses(data);
      setLoading(false);
    };
    fetchBusinesses();
  }, []);

  const filteredAndSortedBusinesses = businesses
    .filter(business => {
      const matchesSearch = 
        business.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.businessType?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || 
        business.businessType?.toLowerCase().includes(filterType.toLowerCase());
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.businessName || '').localeCompare(b.businessName || '');
        case 'type':
          return (a.businessType || '').localeCompare(b.businessType || '');
        case 'owner':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });

  const businessTypes = [...new Set(businesses.map(b => b.businessType).filter(Boolean))];

  if (loading) {
    return (
      <div className="browse-business-loading">
        <div className="loading-spinner-container">
          <div className="elegant-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Discovering local businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-business-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="browse-business-container">
        {/* Header Section */}
        <header className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-building"></i>
            </div>
            <div className="header-text">
              <h1 className="page-title">Business Network Directory</h1>
              <p className="page-subtitle">
                Discover and connect with established businesses in your professional network
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{businesses.length}</span>
              <span className="stat-label">Businesses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{businessTypes.length}</span>
              <span className="stat-label">Industries</span>
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
                placeholder="Search businesses, owners, or industries..."
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
              <label htmlFor="type-filter">Industry:</label>
              <select 
                id="type-filter"
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Industries</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
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
                <option value="name">Business Name</option>
                <option value="type">Industry</option>
                <option value="owner">Owner Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <span className="results-count">
            {filteredAndSortedBusinesses.length} business{filteredAndSortedBusinesses.length !== 1 ? 'es' : ''} found
          </span>
          {(searchTerm || filterType !== 'all') && (
            <button 
              className="clear-filters"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
            >
              <i className="fas fa-times"></i>
              Clear filters
            </button>
          )}
        </div>

        {/* Business Grid */}
        {filteredAndSortedBusinesses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No businesses found</h3>
            <p>Try adjusting your search criteria or browse all businesses</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
            >
              Show All Businesses
            </button>
          </div>
        ) : (
          <main className="business-grid">
            {filteredAndSortedBusinesses.map((business, index) => (
              <article 
                key={business.id} 
                className="business-card"
                onClick={() => navigate(`/business/${business.id}`)}
                style={{ '--animation-delay': `${index * 0.1}s` }}
              >
                {/* Business Image */}
                <div className="business-image-container">
                  {business.image ? (
                    <img 
                      src={business.image} 
                      alt={business.businessName} 
                      className="business-image"
                    />
                  ) : (
                    <div className="business-placeholder">
                      <i className="fas fa-building"></i>
                    </div>
                  )}
                  <div className="business-overlay">
                    <button className="view-details-btn">
                      <i className="fas fa-eye"></i>
                      View Details
                    </button>
                  </div>
                </div>

                {/* Business Info */}
                <div className="business-info">
                  <div className="business-header">
                    <h3 className="business-name">{business.businessName}</h3>
                    <div className="business-type-badge">
                      {business.businessType}
                    </div>
                  </div>
                  
                  <div className="owner-info">
                    <div className="owner-avatar">
                      {business.name?.charAt(0).toUpperCase() || 'O'}
                    </div>
                    <div className="owner-details">
                      <span className="owner-name">{business.name}</span>
                      <span className="owner-title">Business Owner</span>
                    </div>
                  </div>

                  {business.description && (
                    <p className="business-description">
                      {business.description.length > 100 
                        ? `${business.description.substring(0, 100)}...`
                        : business.description
                      }
                    </p>
                  )}

                  <div className="business-details">
                    {business.address && (
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{business.address}</span>
                      </div>
                    )}
                    {business.phone && (
                      <div className="detail-item">
                        <i className="fas fa-phone"></i>
                        <span>{business.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Actions */}
                <div className="business-actions">
                  <button 
                    className="action-btn connect-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle connect logic
                    }}
                  >
                    <i className="fas fa-handshake"></i>
                    Connect
                  </button>
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
                </div>
              </article>
            ))}
          </main>
        )}
      </div>
    </div>
  );
};

export default BrowseBusiness;
