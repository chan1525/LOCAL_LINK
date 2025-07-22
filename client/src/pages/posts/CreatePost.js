import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../../components/PostForm';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const businessSnap = await getDoc(doc(db, 'business_owners', user.uid));
        if (businessSnap.exists()) {
          setUserData({ ...businessSnap.data(), type: 'business' });
        } else {
          const individualSnap = await getDoc(doc(db, 'individuals', user.uid));
          if (individualSnap.exists()) {
            setUserData({ ...individualSnap.data(), type: 'individual' });
          }
        }
      }
    };
    fetchUser();
  }, []);

  const handlePostCreated = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }
    const businessSnap = await getDoc(doc(db, 'business_owners', user.uid));
    if (businessSnap.exists()) {
      navigate('/dashboard/business');
    } else {
      navigate('/dashboard/individual');
    }
  };

  return (
    <div className="create-post-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="create-post-container">
        {/* Navigation Header */}
        <header className="page-navigation">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            title="Return to dashboard"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </button>
          
          <div className="page-breadcrumb">
            <span className="breadcrumb-item">Dashboard</span>
            <i className="fas fa-chevron-right"></i>
            <span className="breadcrumb-item current">Create Post</span>
          </div>
        </header>

        {/* Page Header */}
        <div className="page-hero">
          <div className="hero-content">
            <div className="hero-icon">
              <i className="fas fa-feather-alt"></i>
            </div>
            <div className="hero-text">
              <h1 className="hero-title">Share Your Professional Insights</h1>
              <p className="hero-description">
                Connect with your network by sharing valuable content, industry insights, 
                and professional updates that matter to your community.
              </p>
            </div>
          </div>
          
          {userData && (
            <div className="author-preview">
              <div className="author-avatar">
                {userData.image ? (
                  <img src={userData.image} alt="Your profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {userData.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="author-info">
                <span className="author-name">{userData.name}</span>
                <span className="author-role">
                  {userData.type === 'business' ? 'Business Owner' : 'Professional'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Post Form */}
        <main className="form-section">
          <PostForm onPostCreated={handlePostCreated} />
        </main>

        {/* Professional Tips */}
        <aside className="professional-tips">
          <div className="tips-card">
            <div className="tips-header">
              <div className="tips-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3 className="tips-title">Professional Posting Guidelines</h3>
            </div>
            
            <div className="tips-content">
              <div className="tip-category">
                <h4>Content Excellence</h4>
                <ul>
                  <li>Share authentic insights from your professional experience</li>
                  <li>Use industry-relevant terminology and maintain professionalism</li>
                  <li>Include actionable advice or thought-provoking questions</li>
                </ul>
              </div>
              
              <div className="tip-category">
                <h4>Visual Impact</h4>
                <ul>
                  <li>Add high-quality images that complement your message</li>
                  <li>Use visuals to illustrate complex concepts or data</li>
                  <li>Maintain consistent visual branding when possible</li>
                </ul>
              </div>
              
              <div className="tip-category">
                <h4>Engagement Strategy</h4>
                <ul>
                  <li>Pose questions to encourage meaningful discussions</li>
                  <li>Share success stories and lessons learned</li>
                  <li>Tag relevant connections when appropriate</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreatePost;
