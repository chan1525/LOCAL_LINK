import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import './BusinessDashboard.css';

const navActions = [
  { label: "Create Post", icon: "✍️", route: "/create-post", description: "Share updates", category: "Content" },
  { label: "View Posts", icon: "📖", route: "/posts", description: "See all posts", category: "Content" },
  { label: "Post Job", icon: "🎯", route: "/post-job", description: "Hire talent", category: "Recruitment" },
  { label: "My Jobs", icon: "📊", route: "/my-jobs", description: "Manage jobs", category: "Recruitment" },
  { label: "Browse Business", icon: "🏛️", route: "/browse/business", description: "Find businesses", category: "Network" },
  { label: "Browse Individuals", icon: "👔", route: "/browse/individuals", description: "Find professionals", category: "Network" },
  { label: "Profile", icon: "⚙️", route: "/profile", description: "Manage account", category: "Settings" },
];

const statsCards = [
  { 
    icon: "📈", 
    title: "Business Growth", 
    value: "125%",
    description: "Year-over-year expansion",
    trend: "+23% this month"
  },
  { 
    icon: "🤝", 
    title: "Active Connections", 
    value: "847",
    description: "Professional network",
    trend: "+12 this week"
  },
  { 
    icon: "💼", 
    title: "Job Postings", 
    value: "24",
    description: "Active opportunities",
    trend: "6 new applications"
  },
];

const BusinessDashboard = () => {
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
      const q = doc(db, 'business_owners', user.uid);
      const docSnap = await getDoc(q);
      if (docSnap.exists()) setUserData(docSnap.data());
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
        <p className="loading-text">Preparing your executive dashboard...</p>
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
    <div className="executive-dashboard">
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
            <h4 className="nav-section-title">RECRUITMENT</h4>
            {navActions.filter(action => action.category === "Recruitment").map(action => (
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
            <h1 className="page-title">Executive Dashboard</h1>
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
                <span className="user-role">Business Owner</span>
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
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="welcome-text">
                  <h2>Welcome to your Business Command Center</h2>
                  <p>Monitor your business performance, manage opportunities, and expand your professional network from this centralized hub.</p>
                </div>
              </div>
              <div className="welcome-actions">
                <button 
                  className="cta-button primary"
                  onClick={() => navigate('/create-post')}
                >
                  <i className="fas fa-plus-circle"></i>
                  Create Post
                </button>
                <button 
                  className="cta-button secondary"
                  onClick={() => navigate('/post-job')}
                >
                  <i className="fas fa-briefcase"></i>
                  Post Job
                </button>
              </div>
            </div>
          </section>

          {/* Stats Overview */}
          <section className="stats-overview">
            <h3 className="section-title">Business Metrics</h3>
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

          {/* Business Insights */}
          <section className="business-insights">
            <h3 className="section-title">Business Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-header">
                  <h4>Network Analysis</h4>
                  <i className="fas fa-network-wired"></i>
                </div>
                <div className="insight-content">
                  <p>Your professional network has grown by <strong>23%</strong> this quarter. Consider engaging more with industry connections to maximize opportunities.</p>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-header">
                  <h4>Content Performance</h4>
                  <i className="fas fa-chart-bar"></i>
                </div>
                <div className="insight-content">
                  <p>Your recent posts show <strong>18% higher engagement</strong>. Visual content and industry insights are resonating well with your audience.</p>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-header">
                  <h4>Recruitment Success</h4>
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="insight-content">
                  <p>Job postings receive an average of <strong>15 applications</strong> within 48 hours. Your company brand is attracting quality candidates.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;
