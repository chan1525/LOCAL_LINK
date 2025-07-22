import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import './IndividualDashboard.css';

const navActions = [
  { label: "Create Post", icon: "✍️", route: "/create-post", description: "Share insights", category: "Content" },
  { label: "View Posts", icon: "📖", route: "/posts", description: "Browse feed", category: "Content" },
  { label: "Browse Jobs", icon: "🎯", route: "/jobs", description: "Find opportunities", category: "Career" },
  { label: "My Applications", icon: "📄", route: "/my-applications", description: "Track applications", category: "Career" },
  { label: "My Connections", icon: "🤝", route: "/my-connections", description: "Manage network", category: "Network" },
  { label: "Browse Business", icon: "🏛️", route: "/browse/business", description: "Find companies", category: "Network" },
  { label: "Browse Individuals", icon: "👔", route: "/browse/individuals", description: "Meet professionals", category: "Network" },
  { label: "Profile", icon: "⚙️", route: "/profile", description: "Manage account", category: "Settings" },
];

const statsCards = [
  { 
    icon: "🚀", 
    title: "Career Growth", 
    value: "85%",
    description: "Professional development",
    trend: "+12% this quarter"
  },
  { 
    icon: "🌐", 
    title: "Network Reach", 
    value: "247",
    description: "Professional connections",
    trend: "+18 this month"
  },
  { 
    icon: "💼", 
    title: "Opportunities", 
    value: "15",
    description: "Active applications",
    trend: "3 interviews scheduled"
  },
];

const IndividualDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      const q = doc(db, 'individuals', user.uid);
      const docSnap = await getDoc(q);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="elegant-spinner">
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Preparing your professional dashboard...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Access Restricted</h2>
          <p>Unable to verify your credentials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="individual-dashboard">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">LL</div>
            <span className="logo-text">LOCAL_LINK</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4 className="nav-section-title">CONTENT</h4>
            {navActions.filter(action => action.category === "Content").map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="sidebar-nav-item"
              >
                <span className="nav-icon">{action.icon}</span>
                <span className="nav-label">{action.label}</span>
              </button>
            ))}
          </div>
          
          <div className="nav-section">
            <h4 className="nav-section-title">CAREER</h4>
            {navActions.filter(action => action.category === "Career").map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="sidebar-nav-item"
              >
                <span className="nav-icon">{action.icon}</span>
                <span className="nav-label">{action.label}</span>
              </button>
            ))}
          </div>
          
          <div className="nav-section">
            <h4 className="nav-section-title">NETWORK</h4>
            {navActions.filter(action => action.category === "Network").map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="sidebar-nav-item"
              >
                <span className="nav-icon">{action.icon}</span>
                <span className="nav-label">{action.label}</span>
              </button>
            ))}
          </div>
          
          <div className="nav-section">
            <h4 className="nav-section-title">SETTINGS</h4>
            {navActions.filter(action => action.category === "Settings").map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="sidebar-nav-item"
              >
                <span className="nav-icon">{action.icon}</span>
                <span className="nav-label">{action.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <h1 className="page-title">Professional Dashboard</h1>
            <p className="page-subtitle">
              {getGreeting()}, {userData.name} • {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="top-bar-right">
            <div className="user-profile">
              <div className="user-avatar">
                {userData.image ? (
                  <img src={userData.image} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{userData.name}</span>
                <span className="user-role">Professional</span>
              </div>
              <button
                onClick={async () => { await signOut(auth); navigate('/'); }}
                className="logout-button"
                title="Sign Out"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-card">
              <div className="welcome-content">
                <div className="welcome-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="welcome-text">
                  <h2>Welcome to your Professional Hub</h2>
                  <p>Advance your career, expand your network, and discover new opportunities in your professional journey.</p>
                </div>
              </div>
              <div className="welcome-actions">
                <button 
                  className="cta-button primary"
                  onClick={() => navigate('/create-post')}
                >
                  <i className="fas fa-plus-circle"></i>
                  Share Update
                </button>
                <button 
                  className="cta-button secondary"
                  onClick={() => navigate('/jobs')}
                >
                  <i className="fas fa-search"></i>
                  Find Jobs
                </button>
              </div>
            </div>
          </section>

          {/* Stats Overview */}
          <section className="stats-overview">
            <h3 className="section-title">Professional Metrics</h3>
            <div className="stats-grid">
              {statsCards.map((stat, index) => (
                <div key={stat.title} className="stat-card" style={{'--delay': `${index * 0.1}s`}}>
                  <div className="stat-header">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-trend">{stat.trend}</div>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-title">{stat.title}</div>
                    <div className="stat-description">{stat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions Grid */}
          <section className="quick-actions">
            <h3 className="section-title">Quick Actions</h3>
            <div className="actions-grid">
              {navActions.map((action, index) => (
                <div 
                  key={action.label} 
                  className="action-card"
                  onClick={() => navigate(action.route)}
                  style={{'--delay': `${index * 0.05}s`}}
                >
                  <div className="action-icon">
                    <span>{action.icon}</span>
                  </div>
                  <div className="action-content">
                    <h4 className="action-title">{action.label}</h4>
                    <p className="action-description">{action.description}</p>
                  </div>
                  <div className="action-arrow">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Professional Insights */}
          <section className="professional-insights">
            <h3 className="section-title">Professional Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-header">
                  <h4>Career Development</h4>
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="insight-content">
                  <p>Your professional profile views increased by <strong>32%</strong> this month. Continue sharing valuable content to boost your visibility.</p>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-header">
                  <h4>Network Growth</h4>
                  <i className="fas fa-users"></i>
                </div>
                <div className="insight-content">
                  <p>You've connected with <strong>18 new professionals</strong> recently. Engage with their content to strengthen relationships.</p>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-header">
                  <h4>Job Market Trends</h4>
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="insight-content">
                  <p>Jobs in your field show <strong>25% growth</strong>. Your skills in {userData.skills?.split(',')[0] || 'your expertise'} are in high demand.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default IndividualDashboard;
